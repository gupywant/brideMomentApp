import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
//import { fromTop } from 'react-navigation-transitions';

import Event from './Event';
import ItemDetail from './Home/ItemDetail'

const App = createStackNavigator({
    //Login: { screen: Login },
    Event: { 
      screen: Event,
      navigationOptions: {
        header: null,
        animationEnabled: false
      }
    },
    ItemDetails:{
      screen: ItemDetail,
      navigationOptions: {
        header: null,
        animationEnabled: false
      }
    }
  },
  {
    initialRouteName: 'Event'
  },
);

export default createAppContainer(App);