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
  Dimensions,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  StatusBar, RefreshControl  } from 'react-native';
import { Item,Input,Picker,DatePicker} from 'native-base';
import Modal, { ModalContent } from 'react-native-modals';
import moment from 'moment';
import url from './Url';
const { width, height } = Dimensions.get('window');
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
            modalVisible: false,
            okCancel: "Batal",
            nameIn: "",
            emailIn: "",
            noTlp: "",
            city:"",
            gender:1,
            province:"",
            chosenDate: new Date(),
            resfresing: false,
            postal_code:0,
            address:"",
        }
        this.setDate = this.setDate.bind(this);
    }

    setDate(newDate) {
      this.setState({ chosenDate: newDate });
    }
    componentDidMount(){
      this.fetchApi()
    }
    
    _onRefresh = () => {
      this.setState({refreshing: true});
      this.fetchApi().then(() => {
        this.setState({refreshing: false});
      });
    }
    
    fetchApi = async () => {
      this.setState({
        isLoading: true
      });
      //this.render();
      //return fetch('http://unnamed48.ccug.gunadarma.ac.id/api/a.php')
      return fetch(url+'private/userProfile', {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          token: await AsyncStorage.getItem('token')
        })
      })
      .then((response) => response.json())
      .then(async(responseJson) => {
        if(responseJson.status == 'success'){    
          this.setState({
            isLoading: false,
    //          dataSource: responseJson.account,
            nameIn: responseJson.profile.name,
            emailIn: responseJson.profile.username,
            noTlp: responseJson.profile.tlp,
            gender:responseJson.profile.gender,
            city: responseJson.profile.city,
            province: responseJson.profile.province,
            postal_code: responseJson.profile.postal_code,
            address: responseJson.profile.address,
            chosenDate: new Date(responseJson.profile.birth_date)
          });
        }else{
          ToastAndroid.show('Akses Salah', ToastAndroid.SHORT);
          this.setState({
            isLoading: false,
          });
        }
      })
      .catch((error) =>{
          ToastAndroid.show("Wrong Connection", ToastAndroid.SHORT);
          this.setState({
            isLoading: false,
          });
      });
    }
    
    passwordUbah = async () =>{
      this.setState({
        isLoading: true
      });
      this.setState({ modalVisible: false, okCancel:"Ok" });
      //this.render();
      //return fetch('http://unnamed48.ccug.gunadarma.ac.id/api/a.php')
      return fetch(url+'private/userPassword', {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          token: await AsyncStorage.getItem('token'),
          passwordOld: this.state.passFirst,
          password: this.state.passNew,
          passwordConfirm: this.state.passConf
        })
      })
      .then((response) => response.json())
      .then(async(responseJson) => {
        if(responseJson.status == 'success'){    
          this.setState({
            isLoading: false,
          });
          this.fetchApi();
          ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
        }else{
          ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
          this.setState({
            isLoading: false,
          });
        }
      })
      .catch((error) =>{
          ToastAndroid.show("Wrong Connection", ToastAndroid.SHORT);
          this.setState({
            isLoading: false,
          });
      });
    }
    update = async () =>{

        this.setState({
          isLoading: true
        });
        //this.render();
        //return fetch('http://unnamed48.ccug.gunadarma.ac.id/api/a.php')
        return fetch(url+'private/userUpdate', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: await AsyncStorage.getItem('token'),
            username: this.state.emailIn, 
            name: this.state.nameIn,
            gender: this.state.gender,
            tlp: this.state.noTlp,
            address: this.state.address,
            city: this.state.city,
            province: this.state.province,
            postal_code: this.state.postal_code,
            birth_date: moment(this.state.chosenDate).format('YYYY-MM-DD')
          })
        })
        .then((response) => response.json())
        .then(async(responseJson) => {
          if(responseJson.status == 'success'){    
            this.setState({
              isLoading: false,
            });
            this.fetchApi();
            ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
          }else{
            ToastAndroid.show('Lengkapi data untuk update', ToastAndroid.SHORT);
            this.setState({
              isLoading: false,
            });
          }
        })
        .catch((error) =>{
            ToastAndroid.show("Wrong Connection", ToastAndroid.SHORT);
            this.setState({
              isLoading: false,
            });
        });
    }
    logout = async() => {
      const { navigate } = this.props.navigation;
  
      AsyncStorage.removeItem('loged');
      AsyncStorage.setItem('loged','0');
      navigate('Auth');
    }
  render(){
    return(
        <ScrollView contentContainerStyle={styles.container} refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }>
            <StatusBar backgroundColor="#009688"/>
                { this.state.isLoading
                ? <CustomProgressLoad/>
                : null
                }
            <Text style={styles.judul}>PROFILE</Text>
            <Item rounded style={styles.inputItem}>
                <Input 
                    style={styles.inputBox}
                    placeholder='Nama Lengkap'
                    value={this.state.nameIn}
                    placeholderTextColor = {placeholderColor}
                    selectionColor={selectColor}
                    onChangeText={nameIn => this.setState({nameIn})} />
            </Item>
            <Item rounded style={styles.inputItem}>
                <Input 
                    style={styles.inputBox}
                    placeholder='Email'
                    value={this.state.emailIn}
                    placeholderTextColor = {placeholderColor}
                    selectionColor={selectColor}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={emailIn => this.setState({emailIn})} />
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
                defaultDate={this.state.chosenDate}
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
                    value={this.state.noTlp}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    onChangeText={noTlp => this.setState({noTlp})} />
            </Item>
            <Item rounded style={styles.inputItem}>
              <Input
                style={styles.inputBox}
                placeholder='Alamat'
                value={this.state.address}
                placeholderTextColor = {placeholderColor}
                selectionColor={selectColor}
                onChangeText={address => this.setState({address})}/>
            </Item>
            <Item rounded style={styles.inputItem}>
                <Input 
                    style={styles.inputBox}
                    placeholder='Kota'
                    value={this.state.city}
                    placeholderTextColor = {placeholderColor}
                    selectionColor={selectColor}
                    onChangeText={city => this.setState({city})} />
            </Item>
            <Item rounded style={styles.inputItem}>
                <Input 
                    style={styles.inputBox}
                    placeholder='Provinsi'
                    value={this.state.province}
                    placeholderTextColor = {placeholderColor}
                    selectionColor={selectColor}
                    onChangeText={province => this.setState({province})} />
            </Item>
            <Item rounded style={styles.inputItem}>
                <Input 
                    style={styles.inputBox}
                    placeholder='Kode Pos'
                    value={`${this.state.postal_code}`}
                    placeholderTextColor = {placeholderColor}
                    selectionColor={selectColor}
                    keyboardType="number-pad"
                    onChangeText={postal_code => this.setState({postal_code})} />
            </Item>
            <TouchableOpacity 
                onPress={() => {
                  this.setState({ modalVisible: true, okCancel:"Batal" });
                }}
                style={styles.button}>
                <Text style={styles.buttonText}>
                    Ubah Password
                </Text>
            </TouchableOpacity>

            <View style = {styles.lineStyle} />

            <View style={{flexDirection:'row', flexWrap:'wrap'}}>
              <TouchableOpacity 
                  onPress={this.update.bind(this)} 
                  style={styles.button}>
                  <Text style={styles.buttonText}>
                      Update Profile
                  </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                  onPress={this.logout.bind(this)} 
                  style={styles.button}>
                  <Text style={styles.buttonText}>
                      Logout
                  </Text>
              </TouchableOpacity>
            </View>
            <Modal
              visible={this.state.modalVisible}
              width={width*0.80}
              onTouchOutside={() => {
                this.setState({ modalVisible: false });
              }}
            >
              <ModalContent>
                <Item rounded style={styles.inputItem}>
                  <Input 
                      style={styles.inputBox}
                      placeholder='Password Lama'
                      placeholderTextColor = {placeholderColor}
                      selectionColor={selectColor}
                      secureTextEntry={true}
                      autoCapitalize="none"
                      onChangeText={passFirst => this.setState({passFirst})} />
                </Item>
                <Item rounded style={styles.inputItem}>
                    <Input 
                        style={styles.inputBox}
                        placeholder='Password Baru'
                        placeholderTextColor = {placeholderColor}
                        selectionColor={selectColor}
                        secureTextEntry={true}
                        autoCapitalize="none"
                        onChangeText={passNew => this.setState({passNew})}/>
                </Item>
                <Item rounded style={styles.inputItem}>
                    <Input 
                        style={styles.inputBox}
                        placeholder='Konfirmasi Password'
                        placeholderTextColor = {placeholderColor}
                        selectionColor={selectColor}
                        secureTextEntry={true}
                        autoCapitalize="none"
                        onChangeText={passConf => this.setState({passConf})}/>
                </Item>
                <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                  <TouchableOpacity 
                      onPress={this.passwordUbah.bind(this)} 
                      style={styles.button}>
                      <Text style={styles.buttonText}>
                          Ubah
                      </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                      onPress={() => {
                        this.setState({ modalVisible: false, okCancel:"Batal" });
                      }}
                      style={styles.button}>
                      <Text style={styles.buttonText}>
                          {this.state.okCancel}
                      </Text>
                  </TouchableOpacity>
                </View>
              </ModalContent>
            </Modal>
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
    backgroundColor: '#009688',
    padding: '3%'
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