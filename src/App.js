import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Flex, Box } from 'reflexbox';
import MansTable from './mansTable';
import Form from './Form';
import { Body, Title } from './style';


class App extends Component {
  render() {
    return (   
      <Body className="App">
        <Flex className="Header" align='center' m={2}>
          <Box w={1}>
              <Title className="Header__Title">Тестовое задание 2</Title>
          </Box>
        </Flex>
        <Flex className="Content">
          <Box w={1/4} m={2}>
            <Form />
          </Box>
          <Box w={3/4} m={2}>
            <MansTable />
          </Box>
        </Flex>           
      </Body>
    );
  }
}

export default App;
