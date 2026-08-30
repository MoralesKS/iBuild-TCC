const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        projeto: 'IBuild',
        api: 'online'
    });
});

app.get('/api/teste-banco', async (req, res) => {
    try {
        const [resultado] = await db.query(
            'SELECT DATABASE() AS banco, NOW() AS horario'
        );

        res.json({
            sucesso: true,
            resultado: resultado
        });
    } catch (erro) {
        console.error('Erro no MySQL:', erro);

        res.status(500).json({
            sucesso: false,
            mensagem: erro.message
        });
    }
});

const PORT = process.env.PORT || 3000;

app.get('/api/anuncios', async (req, res) => {
    try {
        const [anuncios] = await db.query(`
            SELECT *
            FROM vw_anuncios_disponiveis
            LIMIT 20
        `);

        res.json({
            sucesso: true,
            anuncios
        });

    } catch (erro) {
        console.error('Erro ao buscar anúncios:', erro);

        res.status(500).json({
            sucesso: false,
            mensagem: erro.message
        });
    }
});

app.post('/api/cadastro/pessoa-fisica', async (req, res) => {

    const {
        firebase_uid,
        nome,
        email,
        telefone,
        cpf,
        data_nascimento
    } = req.body;

    if (!firebase_uid || !nome || !email || !cpf) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'firebase_uid, nome, email e CPF são obrigatórios.'
        });
    }

    const cpfLimpo = String(cpf).replace(/\D/g, '');

    if (cpfLimpo.length !== 11) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'CPF deve possuir 11 dígitos.'
        });
    }

    let conexao;

    try {

        conexao = await db.getConnection();

        await conexao.beginTransaction();

        const [usuarioResultado] = await conexao.query(
            `
            INSERT INTO usuarios (
                firebase_uid,
                nome,
                email,
                telefone,
                senha_hash,
                tipo_usuario,
                tipo_acesso,
                status
            )
            VALUES (?, ?, ?, ?, NULL, 'pessoa_fisica', 'usuario', 'ativo')
            `,
            [
                firebase_uid,
                nome.trim(),
                email.trim().toLowerCase(),
                telefone || null
            ]
        );

        const idUsuario = usuarioResultado.insertId;

        await conexao.query(
            `
            INSERT INTO pessoas_fisicas (
                id_usuario,
                cpf,
                data_nascimento
            )
            VALUES (?, ?, ?)
            `,
            [
                idUsuario,
                cpfLimpo,
                data_nascimento || null
            ]
        );

        await conexao.commit();

        res.status(201).json({
            sucesso: true,
            mensagem: 'Pessoa física cadastrada com sucesso.',
            usuario: {
                id_usuario: idUsuario,
                firebase_uid,
                nome,
                email,
                telefone,
                cpf: cpfLimpo,
                data_nascimento
            }
        });

    } catch (erro) {

        if (conexao) {
            await conexao.rollback();
        }

        console.error('Erro no cadastro:', erro);

        if (erro.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                sucesso: false,
                mensagem: 'E-mail, CPF ou usuário do Firebase já cadastrado.'
            });
        }

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao cadastrar usuário.'
        });

    } finally {

        if (conexao) {
            conexao.release();
        }
    }
});

app.post('/api/cadastro/autonomo', async (req, res) => {
    const {
        firebase_uid,
        nome,
        email,
        telefone,
        cpf,
        profissao,
        descricao_profissional
    } = req.body;

    if (!firebase_uid || !nome || !email || !cpf || !profissao) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Preencha todos os campos obrigatórios.'
        });
    }

    const cpfLimpo = String(cpf).replace(/\D/g, '');

    if (cpfLimpo.length !== 11) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'CPF deve possuir 11 dígitos.'
        });
    }

    let conexao;

    try {
        conexao = await db.getConnection();
        await conexao.beginTransaction();

        const [usuario] = await conexao.query(
            `
            INSERT INTO usuarios (
                firebase_uid,
                nome,
                email,
                telefone,
                senha_hash,
                tipo_usuario,
                tipo_acesso,
                status
            )
            VALUES (?, ?, ?, ?, NULL, 'autonomo', 'usuario', 'ativo')
            `,
            [
                firebase_uid,
                nome.trim(),
                email.trim().toLowerCase(),
                telefone || null
            ]
        );

        const idUsuario = usuario.insertId;

        await conexao.query(
            `
            INSERT INTO autonomos (
                id_usuario,
                cpf,
                profissao,
                descricao_profissional
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                idUsuario,
                cpfLimpo,
                profissao.trim(),
                descricao_profissional || null
            ]
        );

        await conexao.commit();

        res.status(201).json({
            sucesso: true,
            mensagem: 'Autônomo cadastrado com sucesso.',
            id_usuario: idUsuario
        });

    } catch (erro) {
        if (conexao) await conexao.rollback();

        console.error(erro);

        if (erro.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                sucesso: false,
                mensagem: 'E-mail, CPF ou usuário já cadastrado.'
            });
        }

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao cadastrar autônomo.'
        });

    } finally {
        if (conexao) conexao.release();
    }
});

app.post('/api/cadastro/empresa', async (req, res) => {
    const {
        firebase_uid,
        nome,
        email,
        telefone,
        razao_social,
        nome_fantasia,
        cnpj,
        nome_responsavel
    } = req.body;

    if (
        !firebase_uid ||
        !nome ||
        !email ||
        !razao_social ||
        !cnpj ||
        !nome_responsavel
    ) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Preencha todos os campos obrigatórios.'
        });
    }

    const cnpjLimpo = String(cnpj).replace(/\D/g, '');

    if (cnpjLimpo.length !== 14) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'CNPJ deve possuir 14 dígitos.'
        });
    }

    let conexao;

    try {
        conexao = await db.getConnection();
        await conexao.beginTransaction();

        const [usuario] = await conexao.query(
            `
            INSERT INTO usuarios (
                firebase_uid,
                nome,
                email,
                telefone,
                senha_hash,
                tipo_usuario,
                tipo_acesso,
                status
            )
            VALUES (?, ?, ?, ?, NULL, 'empresa', 'usuario', 'ativo')
            `,
            [
                firebase_uid,
                nome.trim(),
                email.trim().toLowerCase(),
                telefone || null
            ]
        );

        const idUsuario = usuario.insertId;

        await conexao.query(
            `
            INSERT INTO empresas (
                id_usuario,
                razao_social,
                nome_fantasia,
                cnpj,
                nome_responsavel
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                idUsuario,
                razao_social.trim(),
                nome_fantasia || null,
                cnpjLimpo,
                nome_responsavel.trim()
            ]
        );

        await conexao.commit();

        res.status(201).json({
            sucesso: true,
            mensagem: 'Empresa cadastrada com sucesso.',
            id_usuario: idUsuario
        });

    } catch (erro) {
        if (conexao) await conexao.rollback();

        console.error(erro);

        if (erro.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                sucesso: false,
                mensagem: 'E-mail, CNPJ ou usuário já cadastrado.'
            });
        }

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao cadastrar empresa.'
        });

    } finally {
        if (conexao) conexao.release();
    }
});

app.get('/api/usuarios/firebase/:uid', async (req, res) => {

    const { uid } = req.params;

    try {

        const [usuarios] = await db.query(
            `
            SELECT
                id_usuario,
                firebase_uid,
                nome,
                email,
                telefone,
                foto_perfil,
                tipo_usuario,
                tipo_acesso,
                status
            FROM usuarios
            WHERE firebase_uid = ?
            LIMIT 1
            `,
            [uid]
        );


        if (usuarios.length === 0) {

            return res.status(404).json({
                sucesso: false,
                mensagem: 'Usuário não encontrado.'
            });

        }


        res.json({
            sucesso: true,
            usuario: usuarios[0]
        });


    } catch (erro) {

        console.error(
            'Erro ao buscar usuário:',
            erro
        );

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao buscar usuário.'
        });

    }

});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`API IBuild rodando na porta ${PORT}`);
});