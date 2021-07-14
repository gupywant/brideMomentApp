import React, { Component } from 'react';
import { ScrollView,RefreshControl,AsyncStorage,ActivityIndicator,ToastAndroid, StatusBar, Text, View,Image,Dimensions,StyleSheet,BackHandler,TouchableOpacity, Alert } from 'react-native';
import {Button, Icon, Fab,Footer,FooterTab,DatePicker} from 'native-base';
import CollapsibleToolbar from 'react-native-collapsible-toolbar';
import SwiperFlatList from 'react-native-swiper-flatlist';
import Modal, {ModalTitle, ModalContent } from 'react-native-modals';
import HTML from 'react-native-render-html';
import moment from 'moment';
import url from '../Url'
const { width, height } = Dimensions.get('window');
export default class ItemDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            active: false,
            bottomModalAndTitle: false,
            dateNow: new Date(),
            date: new Date(),
            dates: new Date(),
            id_item:this.props.navigation.state.params.id_item,
            name: "",
            address: "",
            city: "",
            province: "",
            description: "",
            image: [],
            price: "",
            resfresing: false,
            minimum: new Date()
        }
        this.setDate = this.setDate.bind(this);
        this.setDates = this.setDates.bind(this);
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }
    setDate(newDate) {
        this.setState({ date: newDate, minimum: new Date(newDate) });
      }
    setDates(newDate) {
        this.setState({ dates: newDate });
      }
    _onRefresh = () => {
        this.setState({refreshing: true});
        this.fetchApi().then(() => {
          this.setState({refreshing: false});
        });
      }

    handleBackButtonClick() {
        if(this.state.bottomModalAndTitle){
            this.setState({
                bottomModalAndTitle: false
            });
        }else{
            this.props.navigation.goBack(null);
        }
        return true;
    }

    componentDidMount(){
        const {navigation} = this.props;
        navigation.addListener('willFocus',()=> this.fetchApi())
    }

    componentWillMount() {
        this.addView();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.fetchApi();
        const {navigation} = this.props;
        navigation.addListener('willFocus',()=> this.fetchApi())
    }

    componentWillUnmount() {
        this.addView();
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        const {navigation} = this.props;
        navigation.addListener('willFocus',()=> this.fetchApi())
    }

    componentDidUpdate(){
        const {navigation} = this.props;
        navigation.addListener('willFocus',()=> this.fetchApi())
    }

    fetchApi = async () => {
        this.setState({
            isLoading: true
        });
        return fetch(url+'private/detail', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: await AsyncStorage.getItem('token'),
            id_item: this.state.id_item
        })
        })
        .then((response) => response.json())
        .then(async(responseJson) => {
        if(responseJson.status == 'success'){
            //ToastAndroid.show(responseJson.image[0].file_name, ToastAndroid.SHORT);
            this.setState({
                isLoading: false,
                name: responseJson.item.name,
                address: responseJson.item.address,
                city: responseJson.item.city,
                province: responseJson.item.province,
                description: responseJson.item.description,
                image: responseJson.image,
                price: responseJson.item.price_day.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
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

    addView = async () => {
        this.setState({
            isLoading: true
        });
        return fetch(url+'private/addView', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: await AsyncStorage.getItem('token'),
            id_item: this.state.id_item
        })
        })
        .then((response) => response.json())
        .then(async(responseJson) => {
        if(responseJson.status == 'success'){
            return true;
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

    eventList = async () =>{
        this.setState({
            isLoading: true
        });
        return fetch(url+'private/bookingAdd', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: await AsyncStorage.getItem('token'),
            id_item: this.state.id_item,
            start_date: moment(new Date(this.state.date)).format('YYYY-MM-DD'),
            end_date: moment(new Date(this.state.dates)).format('YYYY-MM-DD')
        })
        })
        .then((response) => response.json())
        .then(async(responseJson) => {
            this.setState({
                isLoading: false,
                bottomModalAndTitle: false
            });
        if(responseJson.status == 'success'){
            const { navigate } = this.props.navigation;
            navigate('Event');
            ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
        }else{
            ToastAndroid.show(responseJson.message, ToastAndroid.SHORT);
        }
        })
        .catch((error) =>{
            ToastAndroid.show("Wrong Connection", ToastAndroid.SHORT);
            this.setState({
                isLoading: false,
            });
        });
    }
    addBookmark = async () => {
        this.setState({
            isLoading: true
        });
        return fetch(url+'private/bookmarkAdd', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: await AsyncStorage.getItem('token'),
            id_item: this.state.id_item
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

    renderContent = () => (
        <View style={{backgroundColor: '#f5f5f5', flex:1}}>
            { this.state.isLoading
            ? <CustomProgressLoad/>
            : null
            }
            <View style={{backgroundColor: '#fff',marginTop: '3%',}}>
                <TouchableOpacity
                    onPress={this.addBookmark}
                    style={{marginLeft:'3%', marginTop:'3%', marginBottom:'3%'}}
                >
                    <Text style={{color: '#009688', fontWeight: 'bold'}}><Icon name="bookmark-o" type="FontAwesome" /> Add to Boookmark</Text>
                </TouchableOpacity>
            </View>
            <View style={{backgroundColor: '#fff',marginTop: '3%'}}>
                <TouchableOpacity
                    onPress={() => {
                        this.setState({
                            bottomModalAndTitle: true,
                        });
                        }}
                    style={{marginLeft:'3%', marginTop:'3%', marginBottom:'3%'}}
                >
                    <Text style={{color: '#009688', fontWeight: 'bold'}}><Icon name="calendar-plus-o" type="FontAwesome" /> Booking Now?</Text>
                </TouchableOpacity>
            </View>
            <View style={{backgroundColor: '#fff',marginTop: '3%'}}>
                <Text style={styles.price}>Lokasi</Text>
                <Text style={styles.detail}>
                    {this.state.city} - {this.state.address}, {this.state.province}
                </Text>
            </View>
            <View style={{backgroundColor: '#fff',marginTop: '3%'}}>
                <Text style={styles.price}>Detail</Text>
                <HTML html={'<div style="padding: 10px;">'+this.state.description+'</div>'}
                styles={styles.detail} imagesMaxWidth={Dimensions.get('window').width} />
            </View>
            <Modal.BottomModal
                visible={this.state.bottomModalAndTitle}
                onTouchOutside={() => this.setState({ bottomModalAndTitle: false })}
                height={0.45}
                width={1}
                onSwipeOut={() => this.setState({ bottomModalAndTitle: false })}
                modalTitle={
                    <ModalTitle
                    title="Booking"
                    hasTitleBar
                    />
                }
                >
                <ModalContent
                    style={{
                    flex: 1,
                    backgroundColor: 'fff',
                    }}
                >
                    <Text style={{marginLeft:'3%', marginTop:'3%',color: '#009688', fontWeight: 'bold'}}>Start Date</Text>
                    <DatePicker
                        style={{width: 200, marginLeft:'3%'}}
                        defaultDate={this.state.date}
                        minimumDate={new Date()}
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
                    <Text style={{marginLeft:'3%',color: '#009688', fontWeight: 'bold'}}>End Date</Text>
                    <DatePicker
                        style={{width: 200, marginLeft:'3%'}}
                        defaultDate={this.state.dates}
                        minimumDate={this.state.minimum}
                        locale={"id"}
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={"fade"}
                        androidMode={"default"}
                        placeHolderText="Select date"
                        textStyle={{ color: "green" }}
                        placeHolderTextStyle={{ color: "#d3d3d3" }}
                        onDateChange={this.setDates}
                        disabled={false}
                    />
                    <View style = {styles.lineStyle} />
                    <TouchableOpacity
                        style={{borderRadius: 15,alignItems: "center",backgroundColor: '#009688', marginBottom:'3%', marginTop:'3%',marginLeft:'3%'}}
                        onPress={this.eventList.bind(this)}
                    >
                        <Text style={{color: 'white', fontWeight: 'bold', marginTop:'3%',marginBottom:'3%'}}><Icon style={{color: 'white'}} name="check-square-o" type="FontAwesome" /> Request Booking</Text>
                    </TouchableOpacity>
                </ModalContent>
            </Modal.BottomModal>
            <Footer style={{backgroundColor: 'rgba(0,0,0,0)', marginBottom: 0}}>
                <FooterTab style={{backgroundColor: 'rgba(0,0,0,0)', marginBottom: 0}}>
                    <Button 
                        onPress={() => {
                        this.setState({
                            bottomModalAndTitle: true,
                        });
                        }}
                        bordered success>
                        <Text style={{color: '#009688', fontWeight: 'bold'}}><Icon name="calendar" type="FontAwesome" /> Booking Now?</Text>
                    </Button>
                </FooterTab>
            </Footer>
        </View>
    );

    renderNavBar = () => (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1
            }}
        >
            <StatusBar backgroundColor="#009688" translucent={false}/>
            <Fab
                active={this.state.active}
                direction="down"
                containerStyle={{ }}
                style={{ backgroundColor: '#009688' }}
                position="topRight"
                onPress={() => this.setState({ active: !this.state.active })}>
                <Icon name="share" />
                <Button style={{ backgroundColor: '#34A34F' }}>
                    <Icon name="logo-whatsapp" />
                </Button>
                <Button style={{ backgroundColor: '#3B5998' }}>
                    <Icon name="logo-facebook" />
                </Button>
                <Button disabled style={{ backgroundColor: '#DD5144' }}>
                    <Icon name="mail" />
                </Button>
            </Fab>
        <Text style={{ textAlign: 'center', color: '#000' }}>{this.state.name}</Text>
        </View>
    );

    renderToolBar= () =>(
        <View>
            {this.state.image.length ?
            <SwiperFlatList
                /*autoplay
                autoplayDelay={5}
                autoplayLoop
                index={0}*/
                autoplayInvertDirection
                paginationStyle={{
                    bottom: height * 0.05 + 30
                }}
                paginationStyleItem={{ 
                    width: 5,
                    height: 5,
                }}
                showPagination
                data={this.state.image}
                renderItem={({ item }) => <Image style={styles.image} source={{ uri: url+'../filesdat/'+`${this.state.id_item}`+'/'+item.file_name }} />}
            />
                : <Image style={styles.image} source={{ uri: url+'../filesdat/default/default_photo.png'  }} />
            }  
            <Text style={styles.price}>Price Rp {this.state.price}/ Day</Text>
        </View>
    );

    render() {
        return (
            <ScrollView style={{flexGrow: 1}}
            refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }>
                <CollapsibleToolbar
                    renderContent={this.renderContent}
                    renderNavBar={this.renderNavBar}
                    renderToolBar={this.renderToolBar}
                    //imageSource='https://thebridedept.s3-ap-southeast-1.amazonaws.com/2018/03/IMG_5309-copy.jpg'
                    collapsedNavBarBackgroundColor='#009688'
                    showsVerticalScrollIndicator={false}
                    // toolBarHeight={300}
                />
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
    image: {
        height: height * 0.3,
        width,
    },
    price:{
        height: height * 0.05,
        marginTop: '3%',
        marginLeft: '3%',
        fontWeight:'bold'
    },
    detail: {
        marginRight: '3%',
        marginLeft: '3%',
        textAlign: 'justify',
        marginBottom: '3%'
    },
    lineStyle:{
        borderWidth: 0.8,
        alignSelf:'stretch',
        borderColor:'#009688',
        margin:10,
    }
})