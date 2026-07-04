import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './Login';
import { BrowserRouter } from 'react-router-dom';
import * as middleware from './middleware';

jest.mock('./middleware', () => ({
    authenticate: jest.fn(),
    findAllGames: jest.fn(),
    findGameImagesByGame: jest.fn()
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn()
}));



  test("renders login form", () => {
    render(
        <BrowserRouter>
          <Login setUserIDProp={jest.fn()} setLogged_InProp={jest.fn()} />
        </BrowserRouter>
      );

    const form = screen.getByTestId("login-form");
    expect(form).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(within(form).getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test("Successful Login", async () => {
    const mockUser = { _id : "123"}
    middleware.authenticate.mockResolvedValue(mockUser)

    const setUserIDProp = jest.fn();
    const setLogged_InProp = jest.fn();
    const navigate = jest.fn()
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);

    render(<BrowserRouter><Login setUserIDProp={setUserIDProp} setLogged_InProp={setLogged_InProp} /></BrowserRouter>);

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'testpass' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
        expect(setUserIDProp).toHaveBeenCalledWith("123");
        expect(setLogged_InProp).toHaveBeenCalledWith(true);
        expect(navigate).toHaveBeenCalledWith("/Home");
      });
  });

  test("failed login displays error", async () => {
    middleware.authenticate.mockResolvedValue(null);
  
    render(<BrowserRouter><Login setUserIDProp={jest.fn()} setLogged_InProp={jest.fn()} /></BrowserRouter>);
  
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  
    await waitFor(() => {
      expect(screen.getByText(/Wrong username or password/i)).toBeVisible();
    });
  });