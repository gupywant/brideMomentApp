/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { ToastAndroid,
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  StatusBar  } from 'react-native';
import { Item,Input,Picker,DatePicker } from 'native-base';
import moment from 'moment';
import url from '../Url';

export default class Register extends React.Component {
    static navigationOptions = {
        title: 'Daftar Baru',
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
            chosenDate: new Date(),
            gender : 1,
        }
        this.setDate = this.setDate.bind(this);
    }

    setDate(newDate) {
      this.setState({ chosenDate: newDate });
    }
    componentDidMount(){
    }

    registerPost(){
      this.setState({
          isLoading: true
      });
      //this.render();
      //return fetch('http://unnamed48.ccug.gunadarma.ac.id/api/a.php')
      return fetch(url+'register', {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          username: this.state.emailIn,
          password: this.state.passwordIn,
          passwordConfirm:this.state.passConf,
          name:this.state.nameIn,
          gender:this.state.gender,
          tlp:this.state.noTlp,
          address:this.state.address,
          city:this.state.city,
          province:this.state.province,
          birth_date:moment(this.state.chosenDate).format('YYYY-MM-DD'),
          postal_code:this.state.postal_code,
          description:'Saya terdaftar lewat Aplikasi'
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
            ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
        }else{
          ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
          this.setState.isLoading= false
        }
      })
      .catch((error) =>{
          ToastAndroid.show("Wrong Connection", ToastAndroid.SHORT);
          this.setState({
            isLoading: false,
          });
      });
    }
    login = () =>{
        const { navigate } = this.props.navigation;
        navigate('Auth')
    }
  render(){
    return(
        <ScrollView contentContainerStyle={styles.container}>
            <StatusBar backgroundColor="#009688"/>
                { this.state.isLoading
                ? <CustomProgressLoad/>
                : null
                }
            <Text style={styles.judul}>REGISTER</Text>
            <Item rounded style={styles.inputItem}>
                <Input 
                    style={styles.inputBox}
                    placeholder='Nama Lengkap'
                    placeholderTextColor = {placeholderColor}
                    selectionColor={selectColor}
                    onChangeText={nameIn => this.setState({nameIn})} />
            </Item>
            <Item rounded style={styles.inputItem}>
                <Input 
                    style={styles.inputBox}
                    placeholder='Email'
                    placeholderTextColor = {placeholderColor}
                    selectionColor={selectColor}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={emailIn => this.setState({emailIn})} />
            </Item>
            <Item rounded style={styles.inputItem}>
                <Input 
                    style={styles.inputBox}
                    placeholder='Password'
                    placeholderTextColor = {placeholderColor}
                    selectionColor={selectColor}
                    secureTextEntry={true}
                    autoCapitalize="none"
                    onChangeText={passwordIn => this.setState({passwordIn})} />
            </Item>
            <Item rounded style={styles.inputItem}>
                <Input 
                    style={styles.inputBox}
                    placeholder='Tulis ulang password'
                    placeholderTextColor = {placeholderColor}
                    selectionColor={selectColor}
                    secureTextEntry={true}
                    autoCapitalize="none"
                    onChangeText={passConf => this.setState({passConf})}/>
            </Item>
            <Item rounded style={styles.inputItem}>
              <Picker
                selectedValue={this.state.gender}
                style={{ height: 50, width: 150, marginTop: '4%' }}
                onValueChange={(itemValue, itemIndex) => this.setState({gender:itemValue})}
              >
                <Picker.Item label="Male" value={1} />
                <Picker.Item label="Female" value={2} />
              </Picker>
            </Item>
            <Item>
              <DatePicker
                style={styles.inputBox}
                defaultDate={new Date()}
                maximumDate={new Date()}
                locale={"id"}
                timeZoneOffsetInMinutes={undefined}
                modalTransparent={false}
                animationType={"fade"}
                androidMode={"default"}
                placeHolderText="Select date"
                textStyle={{ color: "green" }}
                placeHolderTextStyle={{ color: "#d3d3d3" }}
                onDateChange={this.setDate}
                disabled={false}
              />
              <Text>
                Tanggal Lahir : {this.state.chosenDate.toString().substr(4, 12)}
              </Text>
            </Item>
            <Item rounded style={styles.inputItem}>
                <Input 
                    style={styles.inputBox}
                    placeholder='No Telepon'
                    placeholderTextColor = {placeholderColor}
                    selectionColor={selectColor}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    onChangeText={noTlp => this.setState({noTlp})} />
            </Item>
            <Item rounded style={styles.inputItem}>
              <Input
                style={styles.inputBox}
                placeholder='Alamat'
                placeholderTextColor = {placeholderColor}
                selectionColor={selectColor}
                onChangeText={address => this.setState({address})}/>
            </Item>
            <Item rounded style={styles.inputItem}>
                <Input 
                    style={styles.inputBox}
                    placeholder='Kota'
                    placeholderTextColor = {placeholderColor}
                    selectionColor={selectColor}
                    onChangeText={city => this.setState({city})} />
            </Item>
            <Item rounded style={styles.inputItem}>
                <Input 
                    style={styles.inputBox}
                    placeholder='Provinsi'
                    placeholderTextColor = {placeholderColor}
                    selectionColor={selectColor}
                    onChangeText={province => this.setState({province})} />
            </Item>
            <Item rounded style={styles.inputItem}>
                <Input 
                    style={styles.inputBox}
                    placeholder='Kode Pos'
                    placeholderTextColor = {placeholderColor}
                    selectionColor={selectColor}
                    keyboardType="number-pad"
                    onChangeText={postal_code => this.setState({postal_code})} />
            </Item>
            
            <TouchableOpacity 
                onPress={this.registerPost.bind(this)} 
                style={styles.button}>
                <Text style={styles.buttonText}>
                    Register
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

        </ScrollView>
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
    marginTop: '4%',
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