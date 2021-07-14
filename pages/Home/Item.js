import React, { Component } from 'react';
import { StyleSheet,RefreshControl,ActivityIndicator,AsyncStorage,Alert,Image,BackHandler,StatusBar,ScrollView } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import url from '../Url'
export default class Item extends Component {
    static navigationOptions = {
        title: 'Hasil Pencarian',
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
        this.state = {
            result:[],
            resfresing: false,
            isLoading: false,
        }
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.fetchApi().then(() => {
            this.setState({refreshing: false});
        })
    }
    componentDidMount() {
        this.fetchApi()
    }

    handleBackButtonClick() {
        this.props.navigation.goBack(null);
        return true;
    }
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }
    fetchApi = async () => {
        this.setState({
            isLoading: true
        });
        return fetch(url+'private/result', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: await AsyncStorage.getItem('token'),
            lokasi:this.props.navigation.state.params.lokasi,
            type:this.props.navigation.state.params.jenis,
            min:this.props.navigation.state.params.min,
            max:this.props.navigation.state.params.max,
            search:'',
            price:this.props.navigation.state.params.price
        })
        })
        .then((response) => response.json())
        .then(async(responseJson) => {
          if(responseJson.status == 'success'){
            if(responseJson.item == null){
                this.props.navigation.goBack()
            }else{
                this.setState({
                    isLoading: false,
                    result: responseJson.item
                });
            }
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
    itemDetail(){
        const { navigate } = this.props.navigation;
        navigate('ItemDetail')
    }
  render() {
    return (
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
            {this.state.result.map((item,index) => (
            <Card style={{marginLeft: '3%', marginRight: '3%', marginBottom: '3%'}}>
                <CardItem button onPress={() =>this.props.navigation.navigate('ItemDetail',{id_item:item.id_item})}>
                <Left>
                    <Thumbnail onPress={() =>this.props.navigation.navigate('ItemDetail',{id_item:item.id_item})} source={{uri: url+'../filesdat/'+`${item.id_item}`+'/'+item.file_name}} />
                    <Body>
                    <Text>{item.name}</Text>
                    <Text note>{item.city}</Text>
                    </Body>
                </Left>
                </CardItem>
                <CardItem cardBody button onPress={() =>this.props.navigation.navigate('ItemDetail',{id_item:item.id_item})}>
                {!!item.file_name ?
                    <Image onPress={() =>this.props.navigation.navigate('ItemDetail',{id_item:item.id_item})} source={{uri: url+'../filesdat/'+`${item.id_item}`+'/'+item.file_name}} style={{height: 200, width: null, flex: 1}}/>
                : <Image style={styles.image} source={{ uri: url+'../filesdat/default/default_photo.png'  }} style={{height: 200, width: null, flex: 1}}/>
                }
                </CardItem>
                <CardItem>
                    <Text style={{fontWeight:'bold'}}>
                        Rp {item.price_day.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}/Day
                    </Text>
                </CardItem>
            </Card>
            ))}
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