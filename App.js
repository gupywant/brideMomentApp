import React, { Component } from 'react';
import { StatusBar, AsyncStorage, StyleSheet, View, Image, Keyboard } from 'react-native'
//For react-navigation 3.0+
//import { createAppContainer, createStackNavigator } from 'react-navigation';
//For react-navigation 4.0+
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
////example  page
import Example from './pages/Example';
////
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Login/Register';
import Fpassword from './pages/Login/Fpassword';

//import all the screens we are going to switch 
const FadeTransition = (index,position) =>{
  const sceneRange = [index-1,index]
  const outputOpacity = [0,1]
  let transition = position.interpolate({
    inputRage:sceneRange,
    outputRange:outputOpacity
  })
  return {
    opacity:transition
  }
}
const NavigationOptions = () =>{
  return {
    screenInterpolator:(sceneProps)=>{
      const { layout, position, scene } = sceneProps;
      const { index } = scene;
      return FadeTransition(position,index);
    }
  }
}

const AppStack = createStackNavigator({
    //Login: { screen: Login },
    Dashboard: { 
      screen: Dashboard,
      navigationOptions: {
        header: null,
      }
    }
  },
  {
    //initialRouteName: 'Login',
  },
);

const AuthStack = createStackNavigator({ Login : Login, })
const RegisterStack = createStackNavigator({ Register : Register, })
const ForgotStack = createStackNavigator({ Fpassword : Fpassword, })

class AuthLoadingScreen extends Component{
  constructor(props){
    super(props);
    setTimeout(() => {
      this._loadData();
    }, 2500);
  }
  render(){
    return(
        <View style={styles.container}>
          <StatusBar hidden />
          <Image
            source={require('./assets/newlogo.png')}
          />
        </View>
    );
  }

  _loadData = async() => {
      //await AsyncStorage.setItem('loged','1');
      const loged = await AsyncStorage.getItem('loged');
      this.props.navigation.navigate(loged !== '1' ? 'Auth' : 'App');
      Keyboard.dismiss();
  }
}

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
      Register: RegisterStack,
      Fpassword: ForgotStack,
      Example:{
        screen: Example
      }
    },
    {
      initialRouteName: 'AuthLoading',
      transitionConfig: NavigationOptions
    }
  )
);

const styles = StyleSheet.create({
  container : {
    flexGrow: 1,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor : '#fff'
  },
  logo: {
    width: 150,
    height: 150,
  }
});
 