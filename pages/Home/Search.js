//This is an example code for Navigator// 
import React, { Component } from 'react';
//import react in our code. 
import { ActivityIndicator,RefreshControl,AsyncStorage,ToastAndroid,BackHandler, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Alert} from 'react-native';
import { Item,Input,Picker,Text} from 'native-base';
import url from '../Url';
import Icon from 'react-native-vector-icons/FontAwesome';



//end of sample carousel
export default class Search extends Component {
  static navigationOptions = {
    title: 'Temukan Keinginan Anda',
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
    animationEnabled: false
  };

  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      min:0,
      max:0,
      jenis : 1,
      lokasi : '',
      location : [],
      type : [],
      urut: 1,
      resfresing: false,
      isLoading: false,
    }
  }
  _onRefresh = () => {
    this.setState({refreshing: true});
    this.fetchApiLoc();
    this.fetchApiTyp().then(() => {
        this.setState({refreshing: false});
    });
  }
  searchItem(){
    const { navigate } = this.props.navigation;
    navigate('Item',{min:this.state.min, max: this.state.max,jenis:this.state.jenis,lokasi:this.state.lokasi,price:this.state.urut});
  }
  componentDidMount() {
    this.fetchApiLoc();
    this.fetchApiTyp();
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
      const { navigate } = this.props.navigation;
      navigate('Index');
      this.props.navigation.goBack(null);
      return true;
  }

  fetchApiLoc = async () => {
    this.setState({
      isLoading: true
  });
  return fetch(url+'private/lokasi', {
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
          location: responseJson.city
        });
    }else{
      this.setState({
          isLoading: false,
      });
      ToastAndroid.show("Akses Salah", ToastAndroid.SHORT);
    }
  })
  .catch((error) =>{
      ToastAndroid.show("Wrong Connection", ToastAndroid.SHORT);
      this.setState({
        isLoading: false
      });
  });
  }

  fetchApiTyp = async () => {
    this.setState({
      isLoading: true
  });
  return fetch(url+'private/kategori', {
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
          type: responseJson.type
        });
    }else{
      this.setState({
          isLoading: false,
      });
      ToastAndroid.show("Akses Salah", ToastAndroid.SHORT);
    }
  })
  .catch((error) =>{
      ToastAndroid.show("Wrong Connection", ToastAndroid.SHORT);
      this.setState({
        isLoading: false
      });
  });
  }

  render() {
    return(
      <ScrollView refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
        />
      }>
        { this.state.isLoading
        ? <CustomProgressLoad/>
        : null
        }
        <StatusBar backgroundColor="#009688"/>
        <Text style={{fontWeight:'bold', marginLeft: '3%', marginBottom: '3%', marginTop: '3%'}}>
          Set Budget Anda
        </Text>
        <Item rounded style={{marginBottom: '3%', marginLeft: '3%', marginRight: '3%'}}>
          <Input placeholder='Min' value={`${this.state.min}`} onChangeText={min => this.setState({min})} autoFocus={true} keyboardType='numeric' />
        </Item>
        <Text style={{fontWeight:'bold', textAlign: 'center', marginBottom: '3%'}}>
          To
        </Text>
        <Item rounded style={{marginBottom: '3%', marginLeft: '3%', marginRight: '3%'}}>
          <Input placeholder='Max' value={`${this.state.max}`} onChangeText={max => this.setState({max})} keyboardType='numeric'/>
        </Item>
        <Text style={{fontWeight:'bold', marginLeft: '3%', marginBottom: '3%', marginTop: '3%'}}>
          Lokasi
        </Text>
        <Picker
          style={{marginBottom: '3%', marginLeft: '3%', marginRight: '3%'}}
          placeholder="Select Your Location"
          iosIcon={<Icon name="arrow-down" />}
          mode="dropdown"
          selectedValue={this.state.lokasi}
          onValueChange={(itemValue, itemIndex) => this.setState({ lokasi: itemValue })}
        >
          {this.state.location.map((item,index) => (
            <Picker.Item label={item.city} value={item.city} />
          ))}
        </Picker>
        <Text style={{fontWeight:'bold', marginLeft: '3%', marginBottom: '3%', marginTop: '3%'}}>
          Kategori
        </Text>
        <Picker
          style={{marginBottom: '3%', marginLeft: '3%', marginRight: '3%'}}
          placeholder="Select Our Service"
          iosIcon={<Icon name="arrow-down" />}
          mode="dropdown"
          selectedValue={this.state.jenis}
          onValueChange={(itemValue, itemIndex) => this.setState({ jenis: itemValue })}
        >
          {this.state.type.map((item,index) => (
            <Picker.Item label={item.name} value={item.name} />
            ))}
        </Picker>
        <Text style={{fontWeight:'bold', marginLeft: '3%', marginBottom: '3%', marginTop: '3%'}}>
          Ururt berdasarkan
        </Text>
        <Picker
          style={{marginBottom: '3%', marginLeft: '3%', marginRight: '3%'}}
          placeholder="Select Our Service"
          iosIcon={<Icon name="arrow-down" />}
          mode="dropdown"
          selectedValue={this.state.urut}
          onValueChange={(itemValue, itemIndex) => this.setState({ urut: itemValue })}
        >
          <Picker.Item label="Harga Tertinggi" value={1} />
          <Picker.Item label="Harga Terendah" value={2} />
        </Picker>
        <TouchableOpacity 
          onPress={this.searchItem.bind(this)} 
          style={{ borderRadius: 15, marginVertical: 10,
            paddingVertical: 13, width: '40%',alignSelf:'center', marginBottom: '3%',marginLeft: '3%', marginRight: '3%', backgroundColor: '#009688' }}>
          <Text style={{fontSize:16,
            fontWeight:'500',
            color:'#fff',
            textAlign:'center'}}>
          Cari & Temukan
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}
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
});