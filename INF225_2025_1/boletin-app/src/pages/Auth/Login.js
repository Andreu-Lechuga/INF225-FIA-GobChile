import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AuthHeader from '../../components/common/AuthHeader';
import { useAuth } from '../../context';

// Estilos
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const LoginTitle = styled.h2`
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
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo electrónico es obligatorio'),
  password: Yup.string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
});

const Login = () => {
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setIsSubmitting(true);
      setLoginError(''); // Limpiar errores previos
      
      const result = await login(values);
      
      // Si el login es exitoso, redirigir
      if (result && result.user) {
        console.log('Login exitoso:', result.user);
        navigate('/'); // Redirigir al inicio después del login exitoso
      }
    } catch (err) {
      console.error('Error en handleSubmit:', err);
      // El error ya se maneja en el contexto, pero podemos mostrar uno específico aquí
      setLoginError(err.message || 'Error al iniciar sesión. Por favor, intente nuevamente.');
    } finally {
      setSubmitting(false);
      setIsSubmitting(false);
    }
  };
  
  return (
    <LoginContainer>
      <AuthHeader />
      <LoginCard>
        <LoginTitle>Iniciar Sesión</LoginTitle>
        
        {(loginError || error) && (
          <AlertMessage type="error">
            {loginError || error}
          </AlertMessage>
        )}
        
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form>
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
              
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </SubmitButton>
            </Form>
          )}
        </Formik>
        
        <LinkText>
          ¿No tiene una cuenta? <Link to="/signup">Regístrese aquí</Link>
        </LinkText>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
