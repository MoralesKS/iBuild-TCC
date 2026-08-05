import {StyleSheet, TouchableOpacity} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {Feather} from '@expo/vector-icons'

export default function Menu(){
  const navigation = useNavigation()
  return(
    <TouchableOpacity
      style={styles.button}
      onPress={()=>navigation.openDrawer()}
    >
      <Feather name='menu' size={25} color='lightblue' />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button:{
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding:20,
  }
})