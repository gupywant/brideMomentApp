//This is an example code for Navigator// 
import React, { Component } from 'react';
//import react in our code. 
import { Alert,ActivityIndicator,RefreshControl,AsyncStorage,TouchableOpacity,StyleSheet,Image, View, Animated, StatusBar, ScrollView, Dimensions, Keyboard} from 'react-native';
import { Header,Item,Input,Button,Text, Card, CardItem, Body, Left, Right } from 'native-base';
import url from '../Url'
import Icon from 'react-native-vector-icons/FontAwesome';
/// sample carousel
import SwiperFlatList from 'react-native-swiper-flatlist';
//import Carousel from '@r0b0t3d/react-native-carousel';

const { width, height } = Dimensions.get('window');
const HEADER_EXPANDED_HEIGHT = height * 0.41;
const HEADER_COLLAPSED_HEIGHT = 0;


//end of sample carousel
export default class Index extends Component {
    constructor(props) {
        super(props);

        this.state = {
        scrollY: new Animated.Value(0),
        content: {},
        banner: [],
        resfresing: false,
        isLoading: false,
        user: '',
        popularVenue: [],
        nearVenue: [],
        tips: []
        }
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

    fetchApi = async () => {
      this.setState({
          isLoading: true
      });
      return fetch(url+'private/dashboard', {
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
                banner: responseJson.banner,
                user: responseJson.user,
                popularVenue: responseJson.popularVenue,
                nearVenue: responseJson.nearVenue,
                tips: responseJson.tips
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

    move(){
        Keyboard.dismiss();
        const { navigate } = this.props.navigation;
        navigate('Search');
    }
    viewItem(){
      const {navigate} = this.props.navigation;
      navigate('ItemDetail')
    }
  render() {
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
      outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
      extrapolate: 'clamp'
    });
    const headerTitleOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    });
    const heroTitleOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_EXPANDED_HEIGHT-HEADER_COLLAPSED_HEIGHT],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    });

    return(
      <View style={styles.container} refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
        />
      }>
        { this.state.isLoading
        ? <CustomProgressLoad/>
        : null
        }
        <Animated.View style={[styles.header, { height: headerHeight, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }]}>
          <Header searchBar style={{ backgroundColor: '#009688' }} rounded>
            <StatusBar backgroundColor="#009688"/>
            <Item style={{backgroundColor: 'rgba(0,0,0,0.3)', paddingLeft: '5%' }}>
              <Icon name="search" color='white' />
              <Input selectTextOnFocus={false} onFocus={ this.move.bind(this) } placeholder="Search" placeholderTextColor='white' style={{ color: 'white' }} />
              <Icon name="building" style={{ paddingRight: '5%' }} color='white' />
            </Item>
            <Button transparent>
              <Text>Search</Text>
            </Button>
          </Header>
          <Animated.View style={{opacity: heroTitleOpacity, backgroundColor: '#009688'}}>
            <SwiperFlatList
              autoplayInvertDirection
              paginationStyle={{
                bottom: 50
              }}
              paginationStyleItem={{ 
                width: 5,
                height: 5,
              }}
              showPagination
              data={this.state.banner}
              renderItem={({ item }) => <Image onPress={() =>this.props.navigation.navigate('ItemDetail',{id_item:item.id_item})} style={styles.image} source={{ uri: url+'../filesdat/'+`${item.id_item}`+'/'+item.file_name }} /> }
            />
            <Card style={{ height: 40, borderRadius: 12,marginTop:'2%', marginLeft: '3%', marginRight: '3%' }}>
              <CardItem style={{ flex:4, height: 30, borderRadius: 12 }}>
                <Left style={{flex:3}}>
                  <Text>
                    Welcome, {this.state.user}
                  </Text>
                </Left>
                <Right style={{flex:1}}>
                  <Icon name='user'/>
                </Right>
              </CardItem>
            </Card>
          </Animated.View>
          {/*<Animated.Text style={{textAlign: 'center', fontSize: 18, color: 'black', marginTop: 28, opacity: headerTitleOpacity}}>{headerTitle}</Animated.Text>*/}
          {/*<Animated.Text style={{textAlign: 'center', fontSize: 32, color: 'black', position: 'absolute', bottom: 16, left: 16, opacity: heroTitleOpacity}}>apaan</Animated.Text>*/}
        </Animated.View>
        <ScrollView
          contentContainerStyle={this.state.content}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: {
                contentOffset: {
                  y: this.state.scrollY
                }
              }
            }])
          }
          scrollEventThrottle={16}
          style={{borderRadius: 15, backgroundColor: 'white'}}
          >
          {/*<Text style={styles.title}>This is Title</Text>*/}
          <View style={{backgroundColor: 'white'}}>
            <Text style={{fontWeight:'bold', marginLeft: '3%'}}>
              Popular Venue's
            </Text>
            <ScrollView
                onTouchStart={(ev) => { this.setState({ content: { flex: 1 } }); }}
                onMomentumScrollEnd={(e) => { this.setState({ content: {} }); }}
                onScrollEndDrag={(e) => { this.setState({ content: {} }); }} horizontal={true} style={styles.scroll} showsHorizontalScrollIndicator={false} style={{marginTop: '4%', marginLeft: '3%', marginRight: '3%', paddingBottom: 5, height: 185}}>
                { this.state.popularVenue.map((item,index) => (
                <Card style={{ borderRadius: 12, width:150, height: 150 }}>
                  <TouchableOpacity onPress={() =>this.props.navigation.navigate('ItemDetail',{id_item:item.id_item})}>
                    <CardItem cardBody style={{borderTopLeftRadius: 12, borderTopRightRadius: 12}}>
                      {!!item.file_name ?
                        <Image source={{uri: url+'../filesdat/'+`${item.id_item}`+'/'+item.file_name}} style={{height: 200, width: null, flex: 1}} style={{borderBottomLeftRadius: 12,borderBottomRightRadius: 12,borderTopLeftRadius: 12, borderTopRightRadius: 12, height: 150,width: 150, flex: 1}}/>
                        : <Image style={styles.image} source={{ uri: url+'../filesdat/default/default_photo.png'  }} style={{height: 200, width: null, flex: 1}} style={{borderBottomLeftRadius: 12,borderBottomRightRadius: 12,borderTopLeftRadius: 12, borderTopRightRadius: 12, height: 150,width: 150, flex: 1}}/>
                      }
                    </CardItem>
                  </TouchableOpacity>
                </Card>
                ))}
            </ScrollView>
          </View>

          <View style={{backgroundColor: 'white'}}>
            <Text style={{fontWeight:'bold', marginLeft: '3%'}}>
              Venue's dekat anda
            </Text>
            <ScrollView
                onTouchStart={(ev) => { this.setState({ content: { flex: 1 } }); }}
                onMomentumScrollEnd={(e) => { this.setState({ content: {} }); }}
                onScrollEndDrag={(e) => { this.setState({ content: {} }); }} horizontal={true} style={styles.scroll} showsHorizontalScrollIndicator={false} style={{marginTop: '4%', marginLeft: '3%', marginRight: '3%', paddingBottom: 5, height: 185}}>
              { this.state.nearVenue.map((item,index) => (
                <Card style={{ borderRadius: 12, width:150, height: 150 }}>
                  <TouchableOpacity onPress={() =>this.props.navigation.navigate('ItemDetail',{id_item:item.id_item})}>
                    <CardItem cardBody style={{borderTopLeftRadius: 12, borderTopRightRadius: 12}}>
                        {!!item.file_name ?
                          <Image source={{uri: url+'../filesdat/'+`${item.id_item}`+'/'+item.file_name}} style={{height: 200, width: null, flex: 1}} style={{borderBottomLeftRadius: 12,borderBottomRightRadius: 12,borderTopLeftRadius: 12, borderTopRightRadius: 12, height: 150,width: 150, flex: 1}}/>
                          : <Image style={styles.image} source={{ uri: url+'../filesdat/default/default_photo.png'  }} style={{height: 200, width: null, flex: 1}} style={{borderBottomLeftRadius: 12,borderBottomRightRadius: 12,borderTopLeftRadius: 12, borderTopRightRadius: 12, height: 150,width: 150, flex: 1}}/>
                        }
                      </CardItem>
                  </TouchableOpacity>
                </Card>
                ))}
            </ScrollView>
          </View>

          <View style={{backgroundColor: 'white'}}>
            <Text style={{fontWeight:'bold', marginLeft: '3%'}}>
              Tips & Trick
            </Text>
            <ScrollView
                onTouchStart={(ev) => { this.setState({ content: { flex: 1 } }); }}
                onMomentumScrollEnd={(e) => { this.setState({ content: {} }); }}
                onScrollEndDrag={(e) => { this.setState({ content: {} }); }} horizontal={true} style={styles.scroll} showsHorizontalScrollIndicator={false} style={{marginTop: '4%', marginLeft: '3%', marginRight: '3%', paddingBottom: 5, height: 185}}>
              { this.state.tips.map((item,index) => (
                <Card style={{ borderRadius: 12, width:150, height: 150 }}>
                  <TouchableOpacity onPress={() =>this.props.navigation.navigate('Blog',{id_tips:item.id_tips})}>
                    <CardItem cardBody style={{borderTopLeftRadius: 12, borderTopRightRadius: 12}}>
                      {!!item.image ?
                        <Image source={{uri: url+'../filesdat/tips/'+`${item.id_tips}`+'/'+item.image}} style={{height: 200, width: null, flex: 1}} style={{borderBottomLeftRadius: 12,borderBottomRightRadius: 12,borderTopLeftRadius: 12, borderTopRightRadius: 12, height: 150,width: 150, flex: 1}}/>
                        : <Image style={styles.image} source={{ uri: url+'../filesdat/default/default_photo.png'  }} style={{height: 200, width: null, flex: 1}} style={{borderBottomLeftRadius: 12,borderBottomRightRadius: 12,borderTopLeftRadius: 12, borderTopRightRadius: 12, height: 150,width: 150, flex: 1}}/>
                      }
                    </CardItem>
                  </TouchableOpacity>
                </Card>
                ))}
            </ScrollView>
          </View>

          <View style={{backgroundColor: 'white', alignItems: 'center', marginBottom: '10%'}}>
            <Text style={{fontWeight:'bold', marginBottom:'3%'}}>
              Powered By Bride Moment
            </Text>
            <Text style={{fontWeight:'bold', color:'#009688', marginBottom:'3%'}}>
              Bride Moment App v 1.0 - Gupy Wantoro
            </Text>
            <Image
              source={require('../../assets/newlogo.png')}
            />
          </View>
          {/*<View style={{backgroundColor:'white', marginLeft: 0, marginRight: 0}}>
            <Text style={styles.content}>{str}</Text>
        </View>*/}
        </ScrollView>
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
  containerBottom: {
    flex:4,
    zIndex: -1,
    backgroundColor: '#fff',
  },
  containerTop: {
    flex:2,
    zIndex: -1,
    backgroundColor: '#009688',
  },
  //view buat si card disini
  isiContainer:{
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    //top: '8%',
    backgroundColor : 'rgba(0,0,0,0)'
  },
  scroll: {
    height : 150,
    width: '95%',
    paddingTop: '5%'
  },
  image: {
    height: height * 0.25,
    width,
  },
  container: {
    flex: 4,
    backgroundColor: 'white',
  },
  scrollContainer: {
    //padding: 16,
    paddingTop: HEADER_EXPANDED_HEIGHT+3
  },
  header: {
    backgroundColor: '#009688',
    position: 'absolute',
    width: width,
    top: 0,
    left: 0,
    zIndex: 9999
  },
  title: {
    marginVertical: 16,
    color: "black",
    fontWeight: "bold",
    fontSize: 24
  }
});