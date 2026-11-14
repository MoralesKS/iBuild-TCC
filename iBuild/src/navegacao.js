export function voltar(navigation, fallback = 'Home') {
  if (navigation.canGoBack()) navigation.goBack();
  else navigation.navigate(fallback);
}
