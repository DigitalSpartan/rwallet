import React, { Component } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, FlatList
} from 'react-native';
import { Card, CardItem, Body} from 'native-base';
import flex from '../../assets/styles/layout.flex';
import SwipableButtonList from '../../components/common/misc/swipableButtonList';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Header from '../../components/common/misc/header';
import wm from '../../common/wallet/walletManager';
import Parse from 'parse/react-native'

const header = require('../../assets/images/misc/header.png')
const send = require('../../assets/images/icon/send.png')




const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 5,
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    paddingHorizontal: 10,
  },
  sectionContainer: {
    paddingHorizontal: 30,
  },
  addAsset: {
    color: '#77869E',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  addCircle: {
    marginLeft: 10,
    marginRight: 10,
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 38,
  },
  headerView: {
    position: 'absolute',
    width: '100%',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    position: 'absolute',
    top: 48,
    left: 64,
    color: '#FFF',
  },
  headerBoard: {
    width: '85%',
    top: 100,
    height: 166,
  },
  headerBoardView: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  chevron: {
    color: '#FFF',
  },
  myAssetsTitle: {
    position: 'absolute',
    top: 5,
    left: 5,
    fontWeight: 'bold',
    fontSize: 15,
    color: '#000000'
  },
  myAssets: {
    fontSize: 35,
    fontWeight: '900',
    letterSpacing: 2.92,
    color: '#000000',
    top: 10,
    left: 5,
  },
  assetsValue: {
    marginTop: 10,
    marginLeft: 10,
    color: '#000000',
    fontSize: 15,
    letterSpacing: 0.94,
  },
  sending: {
    marginTop: 5,
    marginLeft: 10,
    color: '#000000',
    fontSize: 15,
    letterSpacing: 0.94,
  },
  myAssetsButtonsView: {
    marginTop: 20,
    width: '100%',
    flexDirection: 'row',
  },
  ButtonView: {
    flexDirection: 'row',
    borderRightWidth: 1,
    borderColor: '#D1D1D1',
    marginLeft: 10,
    paddingRight: 10,
  },
  sendIcon: {
    color: '#6875B7',
  },
  receiveIcon: {
    color: '#6FC062',
  },
  swapIcon: {
    color: '#656667',
  },
  sendText: {
    color: '#6875B7',
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.25,
  },
  receiveText: {
    color: '#6FC062',
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.25,
  },
  swapText: {
    color: '#656667',
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.25,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
    paddingBottom: 13,
    paddingTop: 10,
  },
  rowRightR1: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowRightR2: {

  },
  title: {
    fontSize: 16,
    letterSpacing: 0.33,
    color: '#000000',
  },
  amount: {
    alignSelf: 'flex-end',
    color: '#000000',
    fontWeight: '900',
    letterSpacing: 1,
  },
  datetime: {
    color: '#939393',
    fontSize: 12,
  }
});

function Item({ title, icon, amount, datetime}) {
  return (
    <View style={[styles.row]}>
      {icon}
      <View style={styles.rowRight}>
        <View style={[styles.rowRightR1]}>
          <Text style={[styles.title]}>{title}</Text>
        </View>
        <View style={[styles.rowRightR2]}>
          <Text style={styles.amount}>{amount}</Text>
          <Text style={styles.datetime}>{datetime}</Text>
        </View>
      </View>
    </View>
  );
}

class History extends Component {
    static navigationOptions = ({ navigation }) => {
      return{
        header: null,
      }
    };
    listData = [
      {
        type: 'Sending',
        icon: <SimpleLineIcons name="refresh" size={30} style={{color:'#000000'}}/>,
        amount: '0.005BTC',
        datetime: 'a few seconds ago',
      },
      {
        type: 'Received',
        icon: <SimpleLineIcons name="arrow-down-circle" size={30} style={{color:'#6FC062'}} />,
        amount: '1.61BTC',
        datetime: 'Sep 6. 2019',
      },
      {
        type: 'Sent',
        icon: <SimpleLineIcons name="arrow-up-circle" size={30} style={{color:'#6875B7'}} />,
        amount: '0.3BTC',
        datetime: 'Aug 12. 2019',
      },
    ];
    constructor(props) {
      super(props);
      this.refreshData = this.refreshData.bind(this);
      this.state = {}
    }
    componentDidMount(){
      this.refreshData();
    }
    refreshData(){}
    render() {
      const {navigation} = this.props;
      return (
        <View style={[flex.flex1]}>
          <ScrollView>
            <View style={[{height: 300}]}>
              <Image source={header} />
              <View style={styles.headerView}>
                <Text style={styles.headerTitle}>My Default Wallet</Text>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}
                >
                  <Entypo name="chevron-small-left" size={50} style={styles.chevron} />
                </TouchableOpacity>
                <View style={styles.headerBoardView}>
                  <Card style={styles.headerBoard} >
                    <CardItem>
                      <Body>
                        <Text style={styles.myAssets}>1.305 BTC</Text>
                        <Text style={styles.assetsValue}>13,198.6 USD</Text>
                        <Text style={styles.sending}>0.0005 BTC (50.56USD)</Text>
                        <View style={styles.myAssetsButtonsView}>
                          <TouchableOpacity style={styles.ButtonView} onPress={()=>{
                            alert('send');
                          }}>
                            <Entypo name="swap" size={20} style={styles.sendIcon} /><Text style={styles.sendText}>Send</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.ButtonView, {borderRightWidth: 0}]} onPress={()=>{
                            alert('send');
                          }}>
                            <MaterialCommunityIcons name="arrow-down-bold-outline" size={20} style={styles.receiveIcon} /><Text style={styles.receiveText}>Receive</Text>
                          </TouchableOpacity>
                        </View>
                      </Body>
                    </CardItem>
                  </Card>
                </View>
              </View>
            </View>
             <View style={styles.sectionContainer}>
              <Text style={{color: '#000000', fontSize: 13, letterSpacing: 0.25, fontWeight: 'bold', marginBottom: 10}}>Recent</Text>
            </View>
            <View style={styles.sectionContainer}>
              <FlatList
                data={this.listData}
                renderItem={({ item }) => <Item title={item.type} icon={item.icon} amount={item.amount} datetime={item.datetime}  onPress={item.onPress} />}
                keyExtractor={(item) => Math.random()+''}
              />
            </View>
          </ScrollView>
        </View>
      );
    }
}

export default History;
