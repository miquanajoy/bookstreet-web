import { useState } from 'react';
import {
  MDBContainer,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox
}
  from 'mdb-react-ui-kit';
import { useLocation, useParams } from 'react-router-dom';
import { login } from '../_services';

function useCurrentURL() {
  const location = useLocation();
  const params = useParams();

  return {
    pathname: location.pathname.includes("admin") ? location.pathname : location.pathname.replace("/", ""),
    search: location.search,
    params,
  };
}

export default function AuthenPage() {

  const { pathname, search, params } = useCurrentURL();
  const [justifyActive, setJustifyActive] = useState('tab1');

  const handleJustifyClick = (value: any) => {
    if (value === justifyActive) {
      return;
    }

    setJustifyActive(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    const dataForm: any = new FormData(e.target)
    const convertDataForm = [...dataForm];
    const value = {
      "email": convertDataForm[0][1],
      "password": convertDataForm[1][1],
    }
    console.log('value :>> ', value);
    login(value.email, value.password)
    window.location.href = '/books';

  }
  return (
    <div>
      <MDBContainer className="p-3 my-5 d-flex flex-column w-50">

        <MDBTabs pills justify className='mb-3 d-flex flex-row justify-content-between'>
          <MDBTabsItem>
            <MDBTabsLink onClick={() => handleJustifyClick('tab1')} active={justifyActive === 'tab1'}>
              Login
            </MDBTabsLink>
          </MDBTabsItem>
          <MDBTabsItem>
            <MDBTabsLink onClick={() => handleJustifyClick('tab2')} active={justifyActive === 'tab2'}>
              Register
            </MDBTabsLink>
          </MDBTabsItem>
        </MDBTabs>
        <MDBTabsContent>
          {
            justifyActive === 'tab1' ?
              (

                <form onSubmit={handleSubmit}>
                  <div className="text-center mb-3">
                    <p>Sign in with:</p>

                    <div className='d-flex justify-content-between mx-auto' style={{ width: '40%' }}>
                      <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                        <MDBIcon fab icon='facebook-f' size="sm" />
                      </MDBBtn>

                      <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                        <MDBIcon fab icon='twitter' size="sm" />
                      </MDBBtn>

                      <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                        <MDBIcon fab icon='google' size="sm" />
                      </MDBBtn>

                      <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                        <MDBIcon fab icon='github' size="sm" />
                      </MDBBtn>
                    </div>

                    <p className="text-center mt-3">or:</p>
                  </div>

                  <MDBInput wrapperClass='mb-4' label='Email address' id='form1' name="email" type='text' />
                  <MDBInput wrapperClass='mb-4' label='Password' id='form2' name="password" type='password' />

                  <div className="d-flex justify-content-between mx-4 mb-4">
                    <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                    <a href="!#">Forgot password?</a>
                  </div>

                  <MDBBtn className="mb-4 w-100">Sign in</MDBBtn>
                  <p className="text-center">Not a member? <a href="#!">Register</a></p>
                </form>
              )
              : (<div>

                <div className="text-center mb-3">
                  <p>Sign un with:</p>

                  <div className='d-flex justify-content-between mx-auto' style={{ width: '40%' }}>
                    <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                      <MDBIcon fab icon='facebook-f' size="sm" />
                    </MDBBtn>

                    <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                      <MDBIcon fab icon='twitter' size="sm" />
                    </MDBBtn>

                    <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                      <MDBIcon fab icon='google' size="sm" />
                    </MDBBtn>

                    <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
                      <MDBIcon fab icon='github' size="sm" />
                    </MDBBtn>
                  </div>

                  <p className="text-center mt-3">or:</p>
                </div>

                <MDBInput wrapperClass='mb-4' label='Name' id='form1' type='text' />
                <MDBInput wrapperClass='mb-4' label='Username' id='form1' type='text' />
                <MDBInput wrapperClass='mb-4' label='Email' id='form1' type='email' />
                <MDBInput wrapperClass='mb-4' label='Password' id='form1' type='password' />

                <div className='d-flex justify-content-center mb-4'>
                  <MDBCheckbox name='flexCheck' id='flexCheckDefault' label='I have read and agree to the terms' />
                </div>

                <MDBBtn className="mb-4 w-100">Sign up</MDBBtn>

              </div>)
          }
        </MDBTabsContent>

      </MDBContainer>
    </div>
  );
}
