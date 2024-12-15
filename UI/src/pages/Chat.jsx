import React, { useState } from 'react';
import {
  Box,
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
} from '@chakra-ui/react';
import ChatWindow from '../components/chat/ChatWindow';
import ChatSidebar from '../components/chat/ChatSidebar';
import Logo from '../components/Logo';
import Quiz from './features/Quiz';
import Summary from './features/Summary';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          text: "I'm your UniBuddy AI tutor. How can I help you today?",
          sender: 'ai'
        }]);
      }, 1000);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Container maxW="container.xl" py={4}>
        <Flex direction="column" h="calc(100vh - 2rem)">
          <Box mb={4}>
            <Logo size="md" />
          </Box>
          <Box 
            flex="1" 
            bg="white" 
            borderRadius="xl" 
            boxShadow="md" 
            overflow="hidden"
            maxH="85vh" // Increased height
          >
            <Flex h="full">
              <ChatSidebar />
              <Box flex="1">
                <Tabs variant="soft-rounded" colorScheme="blue" size="sm" p={4} h="full">
                  <TabList mb={3}>
                    <Tab fontSize="sm">Chat</Tab>
                    <Tab fontSize="sm">Quiz</Tab>
                    <Tab fontSize="sm">Summary</Tab>
                  </TabList>

                  <TabPanels h="calc(100% - 48px)"> {/* Adjust height to account for TabList */}
                    <TabPanel p={0} h="full">
                      <ChatWindow
                        messages={messages}
                        input={input}
                        setInput={setInput}
                        handleSend={handleSend}
                      />
                    </TabPanel>
                    <TabPanel h="full">
                      <Quiz />
                    </TabPanel>
                    <TabPanel h="full">
                      <Summary />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}

export default Chat;