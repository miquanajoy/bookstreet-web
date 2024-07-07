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
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { alertService, login, registerHandle } from '../_services';
import { Role } from '../models/Role';
import { useForm } from 'react-hook-form';



export default function AuthenPage() {
  const { register, handleSubmit } = useForm();

  const location = useLocation();
  const navigate = useNavigate();

  function useCurrentURL() {
    const params = useParams();

    return {
      pathname: location.pathname.includes(Role.Admin) ? location.pathname : location.pathname.replace("/", ""),
      search: location.search,
      params,
    };
  }
  const { pathname, search, params } = useCurrentURL();
  const [justifyActive, setJustifyActive] = useState('tab1');

  const handleJustifyClick = (value: any) => {
    if (value === justifyActive) {
      return;
    }

    setJustifyActive(value);
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault()
    const dataForm: any = new FormData(e.target)
    const convertDataForm = [...dataForm];
    const value = {
      "email": convertDataForm[0][1],
      "password": convertDataForm[1][1],
    }
    login(value.email, value.password).then(val => {
      // console.log('val :>> ', val);

      if (val.statusCode === 200) {
        switch (val.data.role) {
          case Role.Admin:
            navigate('/books', { replace: true });
            break;
          case Role.Store:

            navigate('/store', { replace: true });
            break;

          default:
            break;
        }
      }
    })

  }
  const registerAccount = (val) => {
    registerHandle({
      ...val,
      "phone": "09727846",
      "address": "string",
      "avatar": "string",
      "role": "ADMINISTRATOR"

    }).then(val => {
      if (val.statusCode === 200) {
        alertService.alert(({
          content: "Register account successful"
        }))
        handleJustifyClick('tab1')
      } else {
        // alertService.error(({
        //   content: "Register account error"
        // }))
      }
    })
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

                <form onSubmit={handleSubmitLogin}>
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

                  <MDBInput wrapperClass='mb-4' label='User name' id='form1' name="email" type='text' />
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


                <form onSubmit={handleSubmit(registerAccount)}>
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

                  <MDBInput wrapperClass='mb-4' label='Name' id='form1' type='text' {...register('username')} />
                  <MDBInput wrapperClass='mb-4' label='Username' id='form1' type='text'  {...register('fullName')} />
                  <MDBInput wrapperClass='mb-4' label='Email' id='form1' type='email'  {...register('email')} />
                  <MDBInput wrapperClass='mb-4' label='Password' id='form1' type='password'  {...register('password')} />

                  <div className='d-flex justify-content-center mb-4'>
                    <MDBCheckbox name='flexCheck' id='flexCheckDefault' label='I have read and agree to the terms' />
                  </div>

                  <MDBBtn className="mb-4 w-100">Sign up</MDBBtn>
                </form>
              </div>)
          }
        </MDBTabsContent>

      </MDBContainer>
    </div>
  );
}
