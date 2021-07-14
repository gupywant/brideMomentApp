/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { ToastAndroid, 
  AsyncStorage,
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar  } from 'react-native';
import { Item,Input,Text } from 'native-base';
import url from '../Url';
export default class Fpassword extends React.Component {
    static navigationOptions = {
        title: 'Lupa Password',
        //Sets Header text of Status Bar
        headerStyle: {
        backgroundColor: '#009688',
        //Sets Header color
        },
        headerTintColor: '#fff',
        //Sets Header text color
        headerTitleStyle: {
        fontWeight: 'bold',
        //Sets Header text style
        },
        animationEnabled: true
    };
  
    constructor(props){
        super(props);
        this.state={
            isLoading: false,
            username: ''
        }
    }



    forgotPost(){
      this.setState({
        isLoading: true
    });
    return fetch(url+'userForgot', {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        username: this.state.username
    })
    })
    .then((response) => response.json())
    .then(async(responseJson) => {
      if(responseJson.status == 'success'){
            this.setState({
                isLoading: false,
            });
            ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
      }else{
        this.setState({
            isLoading: false,
        });
        ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
      }
    })
    .catch((error) =>{
        ToastAndroid.show("Wrong Connection", ToastAndroid.SHORT);
        this.setState({
          isLoading: false
        });
    });
    }

    login(){
        const { navigate } = this.props.navigation;
        navigate('Auth')
    }
  render(){
    return(
        <View style={styles.container}>
          <StatusBar backgroundColor="#009688"/>
            { this.state.isLoading
            ? <CustomProgressLoad/>
            : null
            }
            <Text style={styles.judul}>RESET</Text>
            <Item rounded style={styles.inputItem}>
                <Input 
                    style={styles.inputBox}
                    placeholder='Email'
                    value={this.state.username}
                    placeholderTextColor = "#636363"
                    selectionColor="#fff"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={username => this.setState({username})}/>
            </Item>

            <TouchableOpacity 
                onPress={this.forgotPost.bind(this)} 
                style={styles.button}>
                <Text style={styles.buttonText}>
                    Kirim
                </Text>
            </TouchableOpacity>

            <View style = {styles.lineStyle} />

            <TouchableOpacity 
                onPress={this.login.bind(this)} 
                style={styles.button}>
                <Text style={styles.buttonText}>
                    Login
                </Text>
            </TouchableOpacity>

        </View>
    );
  }
}
// progress bar with modal
const CustomProgressLoad = ()=>(
      <ActivityIndicator size="large" color="#7a96f9" style={styles.load}/>
);
const styles = StyleSheet.create({
  load:{
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
  container : {
    flexGrow: 1,
    justifyContent:'center',
    alignItems: 'center',
  },
  judul:{
    fontSize: 40,
    marginBottom:'5%',
    color: '#009688'
  },
  inputItem: {
    marginBottom: '3%',
    alignItems: 'center',
    width:'85%',
    justifyContent:'center',
    alignSelf:'center'
  },
  inputBox: {
    marginTop: '3%',
    width:'75%',
    alignSelf:'center'
  },
  button: {
    borderRadius: 25, 
    marginVertical: 10,
    paddingVertical: 13, 
    width: '40%',
    alignSelf:'center', 
    marginBottom: '3%',
    marginLeft: '3%', 
    marginRight: '3%',
    backgroundColor: '#009688'
  },
  buttonText: {
    fontSize:16,
    fontWeight:'500',
    color:'#fff',
    textAlign:'center'
  },
  lineStyle:{
    borderWidth: 0.8,
    alignSelf:'stretch',
    borderColor:'#009688',
    margin:10,
   }
});
