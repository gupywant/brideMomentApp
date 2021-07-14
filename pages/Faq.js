//This is an example code for Navigator// 
import React, { Component } from 'react';
//import react in our code. 
import { ToastAndroid,AsyncStorage,StyleSheet, View, Text, StatusBar,Dimensions,WebView, ActivityIndicator} from 'react-native';
import { Accordion } from "native-base";
import HTML from 'react-native-render-html';
import Icon from 'react-native-vector-icons/FontAwesome';
import url from './Url';
//import all the components we are going to use.
//import navigation bar


export default class Faq extends Component {
  static navigationOptions = {
    title: 'Faq',
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
        isLoading: false
    }
  }

  componentWillMount(){
    this.fetchApi()
  }

  componentDidMount(){
    this.fetchApi()
  }

  fetchApi = async () => {
    this.setState({
      isLoading: true
    });
    //this.render();
    //return fetch('http://unnamed48.ccug.gunadarma.ac.id/api/a.php')
    return fetch(url+'private/faq', {
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
        console.log(responseJson)   
        this.setState({
          isLoading: false,
          dataArray: responseJson.faq
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

  _renderHeader(item, expanded) {
    return (
      <View style={{
        flexDirection: "row",
        padding: 10,
        justifyContent: "space-between",
        alignItems: "center" ,
        backgroundColor: "#A9DAD6" }}>
        <Text style={{ fontWeight: "600" }}>
          {" "}{item.pertanyaan}
        </Text>
        {expanded
          ? <Icon style={{ fontSize: 18 }} name="minus-circle" />
        : <Icon style={{ fontSize: 18 }} name="plus-circle" />}
      </View>
    );
  }
  _renderContent(item) {
    return (
      <HTML html={'<div style="padding: 10px;border: 1px solid black; background-color: #e3f1f1;">'+item.jawaban+'</div>'}
      styles={{
        marginLeft:'3%',
        marginRight:'3%',
        backgroundColor: "#e3f1f1",
        padding: 10,
        fontStyle: "italic",
      }} imagesMaxWidth={Dimensions.get('window').width} />
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#009688" translucent={false}/>
        { this.state.isLoading
        ? <CustomProgressLoad/>
        : null
        }
        <Accordion 
          style={{width:'94%', alignSelf:'center', marginTop: '5%'}} 
          dataArray={this.state.dataArray}
          animation={true}
          expanded={true}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          headerStyle={{ backgroundColor: "#009688" }}
          contentStyle={{ backgroundColor: "#00eed8" }}
        expanded={0}/>
      </View>
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
});