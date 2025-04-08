import { View, Text, ScrollView ,RefreshControl} from 'react-native'
import React, {useState } from 'react'
import Header from '../../components/Home/Header'
import Slider from '../../components/Home/Slider'
import PopularBusiness from '../../components/Home/PopularBusiness'


export default function home() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
             >
      <Header/>
      <Slider/>
      <PopularBusiness/>
      <View style={{ height:50}}>
      </View>
    </ScrollView>
  )
}