import React, {ReactNode} from 'react';
import '../index.css';
import './MainLayout.css'
import { Breadcrumb, Layout, Menu, theme } from 'antd';

const { Header, Content, Footer } = Layout;

type Props = {
    children: ReactNode
}
function MainLayout(props: Props) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout 
    // style={{ minHeight: "100vh" }}
    className='layout'
    >
      <Header 
    //   style={{ display: 'flex', alignItems: 'center', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', background: 'white' }}
        className='header'
      >
      <img 
        // style={{width: '100%', maxWidth: '100px'}} 
        className='logo'
        src='Wolt-Logo.png' alt='logo'></img>
      </Header>
      <Content
    //    style={{ padding: '0 48px', backgroundColor:'rgb(226 232 240)' }}\
        className='content'
       >
        <div
        //   style={{
        //     marginTop: '20px',
        //     background: colorBgContainer,
        //     minHeight: 280,
        //     padding: 24,
        //     borderRadius: borderRadiusLG,
        //     boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
        //   }}
            className='content-container'
        >
          {props.children}
        </div>
      </Content>
      <Footer className='footer'>
        Duc Vu Trong ©{new Date().getFullYear()} All Right Reserved
      </Footer>
    </Layout>
  );
};

export default MainLayout;