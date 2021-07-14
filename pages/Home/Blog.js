import React, { Component } from 'react';
import { Dimensions,StyleSheet,RefreshControl,ActivityIndicator,AsyncStorage,Alert,Image,Text,StatusBar,ScrollView } from 'react-native';
import HTML from 'react-native-render-html';
import url from '../Url';
const { width, height } = Dimensions.get('window');
export default class Blog extends Component {
    constructor(props){
        super(props);
        this.state={
            modalVisible: false,
            modalVisibleBookmarks: false,
            isLoading: false,
            resfresing: false,
            image: '',
            blog: '',
            title: '',
            id_tips:this.props.navigation.state.params.id_tips
        }
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.fetchApi().then(() => {
            this.setState({refreshing: false});
        });
    }

    componentDidMount(){
        this.fetchApi()
    }
    fetchApi = async () => {
        this.setState({
            isLoading: true
        });
        return fetch(url+'private/tips', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: await AsyncStorage.getItem('token'),
            id_tips:this.props.navigation.state.params.id_tips
        })
        })
        .then((response) => response.json())
        .then(async(responseJson) => {
          if(responseJson.status == 'success'){
                this.setState({
                    isLoading: false,
                    image: responseJson.tips.image,
                    title: responseJson.tips.title,
                    blog:responseJson.tips.content
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

                <StatusBar backgroundColor="#009688" translucent={false}/> 
                    {!!this.state.image ?
                        <Image style={styles.image} source={{ uri: url+'../filesdat/tips/'+`${this.state.id_tips}`+'/'+this.state.image }}/>
                    : <Image style={styles.image} source={{ uri: url+'../filesdat/default/default_photo.png' }}/>
                    }
                    <Text style={{marginTop:'3%',marginLeft: '2%',marginBottom:'3%', fontWeight:'bold'}}>{this.state.title}</Text>
                    <HTML html={'<div style="padding: 10px;">'+this.state.blog+'</div>'}
                    styles={styles.detail} imagesMaxWidth={Dimensions.get('window').width} />       
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

    image: {
        height: height * 0.3,
        width,
    },
  });