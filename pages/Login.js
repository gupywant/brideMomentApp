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
import url from './Url'

export default class Login extends React.Component {
    static navigationOptions = {
      title: 'Bride Moment Login',
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
      }
    };
  
    constructor(props){
        super(props);
        this.state ={ 
            item : null
        }
    }

    componentDidMount(){
      console.log(url);
    }

    loginGet(){
        const { navigate } = this.props.navigation;
        this.setState({
            isLoading: true
        });
        //this.render();
        //return fetch('http://unnamed48.ccug.gunadarma.ac.id/api/a.php')
        return fetch(url+'login', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: this.state.usernameIn,
            password: this.state.passwordIn,
        })
        })
        .then((response) => response.json())
        .then(async(responseJson) => {
          this.setState({
            isLoading: false,
    //          dataSource: responseJson.account,
            status: responseJson.status
          });
          if(responseJson.status == 'success'){
              await AsyncStorage.setItem('loged', '1');
              await AsyncStorage.setItem('token', responseJson.token);
              navigate("Dashboard");
          }else{
            ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
            this.setState.isLoading= false
            this.setState.status= 0
          }
        })
        .catch((error) =>{
            ToastAndroid.show("Wrong Connection", ToastAndroid.SHORT);
            this.setState({
              isLoading: false,
              status: 0
            });
        });
    }
    register(){
      this.props.navigation.navigate('Register')
    }
    fpassword(){
      this.props.navigation.navigate('Fpassword')
    }
  render(){
    return(
        <View style={styles.container}>
          <StatusBar backgroundColor="#009688"/>
            { this.state.isLoading
            ? <CustomProgressLoad/>
            : null
            }
          <Text style={styles.judul}>LOGIN</Text>
          <Item rounded style={styles.inputItem}>
              <Input 
                  style={styles.inputBox}
                  placeholder='Email'
                  placeholderTextColor = "#636363"
                  selectionColor="#fff"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={usernameIn => this.setState({usernameIn})}
                  onSubmitEditing={()=> this.password.focus()}
                  blurOnSubmit={false}/>
          </Item>
          
          <Item rounded style={styles.inputItem}>
                <Input 
                    style={styles.inputBox}
                    placeholder='Password'
                    placeholderTextColor = {placeholderColor}
                    selectionColor={selectColor}
                    secureTextEntry={true}
                    autoCapitalize="none"
                    onChangeText={passwordIn => this.setState({passwordIn})}
                    ref={(input) => this.password = input} />
          </Item>
          
          <TouchableOpacity 
              onPress={this.loginGet.bind(this)}
              style={styles.button}>
              <Text style={styles.buttonText}>
                  Login
              </Text>
          </TouchableOpacity>

          <View style = {styles.lineStyle} />
          <TouchableOpacity 
              onPress={this.fpassword.bind(this)}
              style={styles.button}>
              <Text style={styles.buttonText}>
                  Lupa Password?
              </Text>
          </TouchableOpacity>
          <TouchableOpacity 
              onPress={this.register.bind(this)}
              style={styles.button}>
              <Text style={styles.buttonText}>
                  Belum Punya Akun?
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
const placeholderColor = '#636363'
const selectColor = '#fff'
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
    width: '50%',
    alignSelf:'center', 
    marginBottom: '3%',
    marginLeft: '3%', 
    marginRight: '3%',
    padding: '3%',
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
