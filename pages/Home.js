import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
//import { fromTop } from 'react-navigation-transitions';

import Index from './Home/Index';
import Search from './Home/Search';
import Item from './Home/Item';
import ItemDetail from './Home/ItemDetail'
import Blog from './Home/Blog'

const App = createStackNavigator({
    //Login: { screen: Login },
    Index: { 
      screen: Index,
      navigationOptions: {
        header: null,
        animationEnabled: false
      }
    },
    Search: { 
      screen: Search
    },
    Item: { 
      screen: Item,
      navigationOptions: {
        animationEnabled: false
      }
    },
    ItemDetail:{
      screen: ItemDetail,
      navigationOptions: {
        header: null,
        animationEnabled: false
      }
    },
    Blog:{
      screen: Blog,
      navigationOptions: {
        header: null,
        animationEnabled: false
      }
    }
  },
  {
    initialRouteName: 'Index'
  },
);

export default createAppContainer(App);