import React from 'react';
import { render, screen, fireEvent, waitFor, within, getByTestId } from '@testing-library/react';
import '@testing-library/jest-dom';
import GamePage from './GamePage';
import { BrowserRouter } from 'react-router-dom';
import * as middleware from './middleware';

jest.mock("./middleware", () => ({
    findGame : jest.fn(),
    findGameImagesByGame : jest.fn(),
    findUser : jest.fn()
}))

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn()
}));

test("Ensure that all information is loaded properly", async () => {
    middleware.findGame.mockResolvedValue({
        date: "2024-12-08T11:40:36.009Z",
        description: "The Mega Man Zero series, known as Rockman Zero (ロックマンゼロ Rokkuman Zero) in Japan, is a video game series by Capcom and Inti Creates that debuted in 2002 on the Game Boy Advance. It is the fifth Mega Man game series released by Capcom, and the third series from the original timeline. It stars the titular Zero, who fights against the oppressive rule of the dystopic Neo Arcadia.",
        name : "Megaman Zero",
        price : 20,
        seller : "6736bba037feb3888625bf19",
        __v : 0,
        _id : "675286a8deb51a810e56d6ca"
    })

    middleware.findGameImagesByGame.mockResolvedValue([{ image : "https://retroresellbucket.s3.us-east-2.amazonaws.com/Mega_Man_Zero_cover%20%281%29.jpg"}])
    
    const mockUser = {
        _id : "123",
        name : "testaccount",
        image : ""
    }
    
    middleware.findUser.mockResolvedValue(mockUser)

    render (
        <BrowserRouter>
            <GamePage userId={mockUser._id} />
        </BrowserRouter>
    )

    await waitFor(() => {
        expect(screen.getByTestId("game-name"))
        expect(screen.getByTestId("game-price"))
        expect(screen.getByTestId("seller-name"))
        expect(screen.getByTestId("seller-pic"))
        expect(screen.getByTestId("game-description"))
        expect(screen.getByTestId("game-images"))
    })
})

test("Ensure that clicking the seller icon navigates to their profile", async () => {
    middleware.findGame.mockResolvedValue({
        date: "2024-12-08T11:40:36.009Z",
        description: "The Mega Man Zero series, known as Rockman Zero (ロックマンゼロ Rokkuman Zero) in Japan, is a video game series by Capcom and Inti Creates that debuted in 2002 on the Game Boy Advance. It is the fifth Mega Man game series released by Capcom, and the third series from the original timeline. It stars the titular Zero, who fights against the oppressive rule of the dystopic Neo Arcadia.",
        name : "Megaman Zero",
        price : 20,
        seller : "6736bba037feb3888625bf19",
        __v : 0,
        _id : "675286a8deb51a810e56d6ca"
    })

    middleware.findGameImagesByGame.mockResolvedValue([{ image : "https://retroresellbucket.s3.us-east-2.amazonaws.com/Mega_Man_Zero_cover%20%281%29.jpg"}])
    
    const mockUser = {
        _id : "123",
        name : "testaccount",
        image : "/static/guest.jpg"
    }
    
    middleware.findUser.mockResolvedValue(mockUser)

    const navigate = jest.fn()
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);

    render (
        <BrowserRouter>
            <GamePage userId={mockUser._id} />
        </BrowserRouter>
    )

    await waitFor(() => {
        const sellerPic = screen.getByTestId("seller-pic");
        fireEvent.click(sellerPic);
        expect(navigate).toBeCalledWith(`/Profile/${mockUser._id}`)
    })
})
