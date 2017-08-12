import React from 'react';
import {
  AppRegistry,
  Text,
  StyleSheet,
  View,
  Button,
  ListView,
  TextInput,
  TouchableHighlight
} from 'react-native';
import { StackNavigator,TabNavigator } from 'react-navigation';

class HomeScreen extends React.Component {
    constructor(){
        super();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            userDataSource: ds,
        };
    }



  static navigationOptions ={
      title: "Name List",
  };
  componentDidMount(){
      fetch('https://jsonplaceholder.typicode.com/users')
        .then((response) => response.json())
        .then((response) => {
          this.setState({
            userDataSource: this.state.userDataSource.cloneWithRows(response)
          });
        });
    }


  renderRow(users, sectionId, rowId, highlightRow){
  
    const { navigate } = this.props.navigation;    
    return(
          <View >
            <Button 
              title={users.name}
              onPress={()=>navigate('Chat',{user:users})}        
            />
          </View>
      )
  }

  render() {
    if(this.state.userDataSource.getRowCount()===0){
        return(
          <View style={styles.container}>
            <Text>loading....</Text>
          </View>
        );
    }
    else {
      return(
        <ListView 
            dataSource={this.state.userDataSource}
            renderRow={this.renderRow.bind(this)}
        />
        );
    }
  }
}

class RecentScreen extends React.Component{
  constructor(){
        super();
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            listDataSource: ds,
        };
    }



  static navigationOptions ={
      title: "todo list",
  };
  componentDidMount(){
      fetch('https://jsonplaceholder.typicode.com/todos')
        .then((response) => response.json())
        .then((response) => {
          this.setState({
            listDataSource: this.state.listDataSource.cloneWithRows(response)
          });
        });
    }


  renderRow(users, sectionId, rowId, highlightRow){
  
    const { navigate } = this.props.navigation;    
    return(
          <View >
            <Button 
              title={users.title}
              onPress={()=>navigate('Todo',{id:users})}        
            />
          </View>
      )
  }

  render() {
    if(this.state.listDataSource.getRowCount()===0){
        return(
          <View style={styles.container}>
            <Text>loading....</Text>
          </View>
        );
    }
    else {
      return(
        <ListView 
            dataSource={this.state.listDataSource}
            renderRow={this.renderRow.bind(this)}
        />
        );
    }
  }
}


class ChatScreen extends React.Component {
  static navigationOptions = ({navigation})=>({
    title: `details  ${navigation.state.params.user.name}`,
  })

  render() {
    const {params}=this.props.navigation.state
    return (
      <View style={styles.container}>
        <Text>{params.user.name}</Text>
        <Text>username: {params.user.username}</Text>
        <Text>email: {params.user.email}</Text>
      </View>
    );
  }
}

class TodosScreen extends React.Component{
  static navigationOptions= ({navigation})=>({
    title: `${navigation.state.params.id.title}`,
  })
  render(){
    const {params}=this.props.navigation.state
    return(
      <View style={styles.container}>
        <Text>
          {params.id.title}
        </Text> 
     </View>
    )
  }
}


class DicScreen extends React.Component{
  constructor(){
    super()
    this.state={
      word:'',
    }
  }
  static navigationOptions=({navigation})=>({
    title: 'dictionary'
  })

  render(){
    const { navigate } = this.props.navigation;
    return(  
      <View  style={styles.button}>
        <TextInput
          style={{height: 40}}
          placeholder="Type you word here!"
          onChangeText={(val) => this.setState({word:val})}
        />
        <TouchableHighlight  onPress={()=>navigate('translate',{word:this.state.word})}>
          <View>
            <Text >translate</Text>
          </View>
        </TouchableHighlight>
        
      </View> 
      
    )
  }
}

class TranslateScreen extends React.Component{
  static navigationOptions=({navigation})=>({
    title: `${navigation.state.params.word}`,
  })

  constructor(){
    super()
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state={
      meaning: ds,
    
    }
  }
 
  componentDidMount(){
    const {params}=this.props.navigation.state
    fetch(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20170612T184703Z.c9ff840dacd71602.3fe9b8816d4e80c302fe0805b055d47d47ab2dfa&lang=en-en&text=${params.word}`)
    .then((response) => response.json())
        .then((response) => {
          this.setState({
            meaning: this.state.meaning.cloneWithRows(response.def)
          });
        });
  }

  renderRow(users, sectionId, rowId, highlightRow){
    const { navigate } = this.props.navigation;
    return(
      <View>
        { users.tr.map((item) => (
        <View >
          <Button
            title={item.text}
            onPress={()=>navigate('wordDetails',{word:item})}
          />          
        </View>
      ))}
    </View>
          
      )
  }  
  render(){
    if(this.state.meaning.getRowCount()===0){
      return(
        <View style={styles.container}>
          <Text>not found</Text>
        </View>
      );
    }
    else{
      const {params}=this.props.navigation.state
      return(
      <View>
        <ListView
          dataSource={this.state.meaning}
          renderRow={this.renderRow.bind(this)}
        />
      </View>
      )
    }
    
    }
        
}

class WordDetail extends React.Component{
  static navigationOptions=({navigation})=>({
    title: `${navigation.state.params.word.text}`,
  })
  render(){
    const {params}=this.props.navigation.state
    return(
      <View>
        <Text>{params.word.text}</Text>
        <Text>{params.word.pos}</Text>
        <Text>{params.word.ts}</Text>
      </View>
    )
  }
}


const MainScreenNavigator = TabNavigator({
  name: { screen: HomeScreen },
  todoList: { screen: RecentScreen},
  dictionary: {screen: DicScreen}
});

export default SimpleApp = StackNavigator({
  Home: { screen: MainScreenNavigator },
  Chat: { screen: ChatScreen },
  Todo:{screen: TodosScreen},
  translate:{screen:TranslateScreen},
  wordDetails:{screen:WordDetail}
});



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button:{
    flex:1,
    backgroundColor: '#eff0f1',
    justifyContent: 'center',
    alignItems: 'center',


  }
});
