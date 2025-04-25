import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthHeader from '../../components/common/AuthHeader';
import { useAuth } from '../../context';

// Estilos (reutilizando los mismos estilos que en Login.js)
const SignUpContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
`;

const SignUpCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const SignUpTitle = styled.h2`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-size: 1.8em;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #2c3e50;
  font-weight: 500;
`;

const Input = styled(Field)`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-family: inherit;
  font-size: 1em;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #2c3e50;
  }
`;

const ErrorText = styled.div`
  color: #e74c3c;
  font-size: 0.9em;
  margin-top: 5px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background: linear-gradient(145deg, #34495e, #2c3e50);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(52, 73, 94, 0.3);
  }
  
  &:disabled {
    background: #95a5a6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 20px;
  color: #7f8c8d;
  
  a {
    color: #2c3e50;
    font-weight: 600;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const AlertMessage = styled.div`
  padding: 15px;
  background-color: ${props => props.type === 'error' ? '#f8d7da' : '#d4edda'};
  color: ${props => props.type === 'error' ? '#721c24' : '#155724'};
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
`;

// Esquema de validación con Yup
const SignUpSchema = Yup.object().shape({
  username: Yup.string()
    .required('El nombre de usuario es obligatorio')
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo electrónico es obligatorio'),
  password: Yup.string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
    .required('Confirmar contraseña es obligatorio')
});

const SignUp = () => {
  const { signup, error } = useAuth();
  const navigate = useNavigate();
  const [signupError, setSignupError] = useState('');
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Eliminar confirmPassword antes de enviar los datos
      const { confirmPassword, ...userData } = values;
      await signup(userData);
      navigate('/'); // Redirigir al inicio después del registro exitoso
    } catch (err) {
      setSignupError('Error al registrar usuario. Por favor, intente nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <SignUpContainer>
      <AuthHeader />
      <SignUpCard>
        <SignUpTitle>Crear Cuenta</SignUpTitle>
        
        {(signupError || error) && (
          <AlertMessage type="error">
            {signupError || error}
          </AlertMessage>
        )}
        
        <Formik
          initialValues={{ 
            username: '', 
            email: '', 
            password: '', 
            confirmPassword: '' 
          }}
          validationSchema={SignUpSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
              <FormGroup>
                <Label htmlFor="username">Nombre de Usuario</Label>
                <Input 
                  type="text" 
                  id="username" 
                  name="username" 
                  placeholder="Ingrese su nombre de usuario" 
                />
                <ErrorMessage name="username" component={ErrorText} />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="Ingrese su correo electrónico" 
                />
                <ErrorMessage name="email" component={ErrorText} />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  type="password" 
                  id="password" 
                  name="password" 
                  placeholder="Ingrese su contraseña" 
                />
                <ErrorMessage name="password" component={ErrorText} />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input 
                  type="password" 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  placeholder="Confirme su contraseña" 
                />
                <ErrorMessage name="confirmPassword" component={ErrorText} />
              </FormGroup>
              
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Registrando...' : 'Registrarse'}
              </SubmitButton>
            </Form>
          )}
        </Formik>
        
        <LinkText>
          ¿Ya tiene una cuenta? <Link to="/login">Inicie sesión aquí</Link>
        </LinkText>
      </SignUpCard>
    </SignUpContainer>
  );
};

export default SignUp;
