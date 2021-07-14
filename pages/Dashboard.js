//This is an example code for Navigator// 
import React, { Component } from 'react';
//import react in our code. 
import { StyleSheet, View, Text} from 'react-native';
import { createAppContainer } from 'react-navigation';
//import all the components we are going to use.
//import navigation bar
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Home from './Home';
import Profile from './Profile';
import Faq from './Faq';
import EventNav from './EventNav';
  
const TabNavigator = createMaterialBottomTabNavigator({
  Home: { screen : Home,
    navigationOptions:{
      tabBarLabel:'Home',
      tabBarIcon: ({tintColor}) => (
        <View>
          <Icon style={[{color:tintColor}]} size={25} name="home"/>
        </View>
      ),
    }
  },
  EventNav: { screen : EventNav,
    navigationOptions:{
      tabBarLabel:'Event',
      tabBarIcon: ({tintColor}) => (
        <View>
          <Icon style={[{color:tintColor}]} size={23} name="calendar-check-o"/>
        </View>
      ),
      activeColor: '#f0edf6',
      inactiveColor: '#86e3da',
      barStyle : {backgroundColor:'#009688'}
    }
  },
  Faq: { screen : Faq,
    navigationOptions:{
      tabBarLabel:'Faq',
      tabBarIcon: ({tintColor}) => (
        <View>
          <Icon style={[{color:tintColor}]} size={25} name="question-circle"/>
        </View>
      ),
      activeColor: '#f0edf6',
      inactiveColor: '#86e3da',
      barStyle : {backgroundColor:'#009688'}
    }
  },
  Profile: { screen : Profile,
    navigationOptions:{
      tabBarLabel:'Profile',
      tabBarIcon: ({tintColor}) => (
        <View>
          <Icon style={[{color:tintColor}]} size={23} name="user-circle"/>
        </View>
      ),
      activeColor: '#f0edf6',
      inactiveColor: '#86e3da',
      barStyle : {backgroundColor:'#009688'}
    }
  },
},
{
  initialRouteName : 'Home',
  activeColor: '#f0edf6',
  inactiveColor: '#86e3da',
  barStyle : {backgroundColor:'#009688'}
}
);

export default createAppContainer(TabNavigator); 