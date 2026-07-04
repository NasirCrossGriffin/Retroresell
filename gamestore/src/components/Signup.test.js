import React from 'react';
import { render, screen, fireEvent, waitFor, within, getByTestId } from '@testing-library/react';
import '@testing-library/jest-dom';
import Signup from './Signup';
import { BrowserRouter } from 'react-router-dom';
import * as middleware from './middleware';

jest.mock("./middleware", () => ({
    findUserByName : jest.fn(),
    postUser : jest.fn(),
    uploadToAWS : jest.fn()
}))

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn()
}));



test("Test valid signup", async () => {
    const mockUser = {
        _id : "123",
        password : "0123456789",
        name : "testaccount",
        email : "test@gmail.com",
        image : "/test"
    }

    middleware.postUser.mockResolvedValue(mockUser);

    middleware.uploadToAWS.mockResolvedValue("/test");

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });

    const setUserIDProp = jest.fn();

    const setLogged_InProp = jest.fn();

    const navigate = jest.fn()
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);

    render (
        <BrowserRouter>
            <Signup setUserIDProp={setUserIDProp} setLogged_InProp={setLogged_InProp} />
        </BrowserRouter>
    )

    await waitFor(() => {
        fireEvent.change(screen.getByTestId("email-input"), { target : {value : mockUser.email} })
        fireEvent.change(screen.getByTestId("username-input"), { target : {value : mockUser.name} })
        fireEvent.change(screen.getByTestId("password-input"), { target : {value : mockUser.password} })
        fireEvent.change(screen.getByTestId("file-input"), { target : {files: [file]}  })
        fireEvent.click(screen.getByTestId("submit-input"))

        expect(setUserIDProp).toHaveBeenCalledWith("123")
        expect(setLogged_InProp).toHaveBeenCalledWith(true)
        expect(navigate).toHaveBeenCalledWith("/Home")
    })
}) 