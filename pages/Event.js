import React, { Component } from 'react';
import { Alert,RefreshControl,AsyncStorage, ActivityIndicator, ScrollView, StatusBar, Text, View,TouchableOpacity,ToastAndroid,Dimensions,StyleSheet } from 'react-native';
import { Tab, Tabs, Thumbnail, Container } from 'native-base';
import Modal, {ModalContent } from 'react-native-modals';
import moment from 'moment';
import url from './Url'
const { width, height } = Dimensions.get('window');
export default class Event extends Component{
    constructor(props){
        super(props);
        this.state={
            modalVisible: false,
            modalVisibleBookmarks: false,
            isLoading: false,
            req: [],
            res:[],
            boo:[],
            id_booking:0,
            id_item:0,
            id_bookmark:0,
            resfresing: false,
        }
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.fetchApiReq();
        this.fetchApiRes();
        this.fetchApiBoo().then(() => {
            this.setState({refreshing: false});
        });
    }

    componentDidMount(){
        this.fetchApiReq();
        this.fetchApiRes();
        this.fetchApiBoo();
    }


    fetchApiReq = async () =>{
        this.setState({
            isLoading: true
        });
        //this.render();
        //return fetch('http://unnamed48.ccug.gunadarma.ac.id/api/a.php')
        return fetch(url+'private/bookingRequesting', {
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
                req: responseJson.list
              });
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
              req:[]
            });
        });
    }

    fetchApiRes = async () =>{
        this.setState({
            isLoading: true
        });
        //this.render();
        //return fetch('http://unnamed48.ccug.gunadarma.ac.id/api/a.php')
        return fetch(url+'private/bookingReserved', {
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
                res: responseJson.list
              });
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
              res:[]
            });
        });
    }

    fetchApiBoo = async () =>{
        this.setState({
            isLoading: true
        });
        //this.render();
        //return fetch('http://unnamed48.ccug.gunadarma.ac.id/api/a.php')
        return fetch(url+'private/bookmarkList', {
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
                boo: responseJson.list
              });
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
              boo:[]
            });
        });
    }

    viewItemBookmarks = async() => {
        this.setState({ modalVisibleBookmarks: false});
        const {navigate} = this.props.navigation;
        navigate('ItemDetails',{id_item:this.state.id_item})
    }
    deleteReqBookmarks = async () =>{
        this.setState({
            isLoading: true
        });
        //this.render();
        //return fetch('http://unnamed48.ccug.gunadarma.ac.id/api/a.php')
        return fetch(url+'private/bookmarkDelete', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: await AsyncStorage.getItem('token'),
            id_bookmark: this.state.id_bookmark
        })
        })
        .then((response) => response.json())
        .then(async(responseJson) => {
          if(responseJson.status == 'success'){
            this.setState({
                isLoading: false,
                modalVisibleBookmarks: false
              });
              this.fetchApiBoo();
              ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
          }else{
            ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
            this.setState({
                modalVisible: false,
                isLoading: false,
            });
          }
        })
        .catch((error) =>{
            ToastAndroid.show("Wrong Connection", ToastAndroid.SHORT);
            this.setState({
                modalVisible: false,
              isLoading: false
            });
        });
    }
    viewItem(){
        this.setState({ modalVisible: false});
        const {navigate} = this.props.navigation;
        navigate('ItemDetails',{id_item:this.state.id_item})
    }
    deleteReq = async () => {
        this.setState({
            isLoading: true
        });
        //this.render();
        //return fetch('http://unnamed48.ccug.gunadarma.ac.id/api/a.php')
        return fetch(url+'private/bookingDelete', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: await AsyncStorage.getItem('token'),
            id_booking: this.state.id_booking
        })
        })
        .then((response) => response.json())
        .then(async(responseJson) => {
          if(responseJson.status == 'success'){
            this.setState({
                isLoading: false,
                modalVisible: false
              });
              this.fetchApiReq();
              ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
          }else{
            ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
            this.setState({
                modalVisible: false,
                isLoading: false,
            });
          }
        })
        .catch((error) =>{
            ToastAndroid.show("Wrong Connection", ToastAndroid.SHORT);
            this.setState({
                modalVisible: false,
              isLoading: false
            });
        });
    }
    render(){
        return(
            <ScrollView contentContainerStyle={{flexGrow:1}} refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }>
                { this.state.isLoading
                ? <CustomProgressLoad/>
                : null
                }
                <Tabs>
                <Tab heading="Requesting" textStyle={{color:'#86e3da'}} activeTextStyle={{color:'#f0edf6'}} activeTabStyle={{backgroundColor: '#009688'}} tabStyle={{backgroundColor: '#009688'}}>         
                    <Modal
                        visible={this.state.modalVisible}
                        width={width*0.80}
                        onTouchOutside={() => {
                            this.setState({ modalVisible: false });
                        }}
                        >
                        <ModalContent>
                            <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                            <TouchableOpacity 
                                onPress={this.viewItem.bind(this)} 
                                style={styles.button}>
                                <Text style={styles.buttonText}>
                                    View
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={this.deleteReq.bind(this)}
                                style={styles.button}>
                                <Text style={styles.buttonText}>
                                    Delete
                                </Text>
                            </TouchableOpacity>
                            </View>
                        </ModalContent>
                    </Modal>
                    <ScrollView>
                        <StatusBar backgroundColor="#009688" translucent={false}/>
                        {this.state.req.map((item,index) => (
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#F5F5F5',
                                    padding: 10,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#E5E5E5',
                                    flexDirection:'row', flexWrap:'wrap'
                                }}
                                onPress={() =>this.setState({ modalVisible: true,id_item:item.id_item,id_booking:item.id_booking})}
                            >
                                <Thumbnail square source={{uri: url+'../filesdat/'+`${item.id_item}`+'/'+item.file_name}} />
                                <View>
                                    <Text style={{fontWeight:'bold', marginLeft:3}}>{item.name} - {item.city}</Text>
                                    <Text style={{fontWeight:'bold',marginLeft:3, marginTop:3}}>{moment(item.start_date).format('D MMMM YYYY')} - {moment(item.end_date).format('D MMMM YYYY')}</Text>
                                </View>
                            </TouchableOpacity>
                            
                        ))}
                    </ScrollView>
                </Tab>
                <Tab heading="Reserved" textStyle={{color:'#86e3da'}} activeTextStyle={{color:'#f0edf6'}} activeTabStyle={{backgroundColor: '#009688'}} tabStyle={{backgroundColor: '#009688'}}>
                    <ScrollView>
                        <StatusBar backgroundColor="#009688" translucent={false}/>
                        {this.state.res.map((item,index) => (
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#F5F5F5',
                                padding: 10,
                                borderBottomWidth: 1,
                                borderBottomColor: '#E5E5E5',
                                flexDirection:'row', flexWrap:'wrap'
                            }}
                            onPress={() => {
                                this.props.navigation.navigate('ItemDetails',{id_item:item.id_item})
                            }}
                        >
                            <Thumbnail square source={{uri: url+'../filesdat/'+`${item.id_item}`+'/'+item.file_name}} />
                            <View>
                                <Text style={{fontWeight:'bold',marginLeft:3}}> {item.name} - {item.city}</Text>
                                <Text style={{fontWeight:'bold',marginLeft:3,marginTop:3}}> {moment(item.start_date).format('D MMMM YYYY')} - {moment(item.end_date).format('D MMMM YYYY')}</Text>
                            </View>
                        </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Tab>
                <Tab heading="Bookmarks" textStyle={{color:'#86e3da'}} activeTextStyle={{color:'#f0edf6'}} activeTabStyle={{backgroundColor: '#009688'}} tabStyle={{backgroundColor: '#009688'}}>
                    <ScrollView>
                        <StatusBar backgroundColor="#009688" translucent={false}/>
                        <Modal
                            visible={this.state.modalVisibleBookmarks}
                            width={width*0.80}
                            onTouchOutside={() => {
                                this.setState({ modalVisibleBookmarks: false });
                            }}
                            >
                            <ModalContent>
                                <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                                <TouchableOpacity 
                                    onPress={this.viewItemBookmarks.bind(this)} 
                                    style={styles.button}>
                                    <Text style={styles.buttonText}>
                                        View
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={this.deleteReqBookmarks.bind(this)}
                                    style={styles.button}>
                                    <Text style={styles.buttonText}>
                                        Delete
                                    </Text>
                                </TouchableOpacity>
                                </View>
                            </ModalContent>
                        </Modal>
                        {this.state.boo.map((item,index) => (
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#F5F5F5',
                                padding: 10,
                                borderBottomWidth: 1,
                                borderBottomColor: '#E5E5E5',
                                flexDirection:'row', flexWrap:'wrap'
                            }}
                            onPress={() =>this.setState({ modalVisibleBookmarks: true,id_item:item.id_item,id_booking:item.id_booking})}
                        >
                            <Thumbnail square source={{uri: url+'../filesdat/'+`${item.id_item}`+'/'+item.file_name}} />
                            <View>
                                <Text style={{fontWeight:'bold',marginLeft:3}}> {item.name}</Text>
                                <Text style={{fontWeight:'bold',marginLeft:3,marginTop:3}}> {item.city}</Text>
                            </View>
                        </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Tab>
            </Tabs>
        </ScrollView>
        )
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