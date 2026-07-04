import React from 'react';
import { render, screen, fireEvent, waitFor, within, getByTestId } from '@testing-library/react';
import '@testing-library/jest-dom';
import LandingPage from './LandingPage';
import { BrowserRouter } from 'react-router-dom';
import * as middleware from './middleware';

//Mock the middleware functions
jest.mock("./middleware", () => ({
    findAllGames : jest.fn(),
    findGameImagesByGame : jest.fn()
}));

//Mock the react-router dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn()
}));
  
  test("renders search bar", () => {
    render(
        <BrowserRouter>
          <LandingPage />
        </BrowserRouter>
      );

    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
  })

  test("displays 'no games' when the search yields no results", async () => {
    middleware.findAllGames.mockResolvedValue([]);
    
    render(
        <BrowserRouter>
          <LandingPage />
        </BrowserRouter>
      );

    
    await waitFor(() => {
        screen.debug();
        expect(screen.getByTestId('no-games')).toBeInTheDocument();
    });
  })

  test("displays games when the search yields results", async () => {
    const testGame1 = {
        date: "2024-12-08T11:40:36.009Z",
        description: "The Mega Man Zero series, known as Rockman Zero (ロックマンゼロ Rokkuman Zero) in Japan, is a video game series by Capcom and Inti Creates that debuted in 2002 on the Game Boy Advance. It is the fifth Mega Man game series released by Capcom, and the third series from the original timeline. It stars the titular Zero, who fights against the oppressive rule of the dystopic Neo Arcadia.",
        name : "Megaman Zero",
        price : 20,
        seller : "6736bba037feb3888625bf19",
        __v : 0,
        _id : "675286a8deb51a810e56d6ca"
    }

    const testGame2 = {
        date: "2024-12-08T11:40:36.009Z",
        description: "The Mega Man Zero series, known as Rockman Zero (ロックマンゼロ Rokkuman Zero) in Japan, is a video game series by Capcom and Inti Creates that debuted in 2002 on the Game Boy Advance. It is the fifth Mega Man game series released by Capcom, and the third series from the original timeline. It stars the titular Zero, who fights against the oppressive rule of the dystopic Neo Arcadia.",
        name : "Megaman Zero",
        price : 20,
        seller : "6736bba037feb3888625bf19",
        __v : 0,
        _id : "675286a8deb51a810e56d6ca"
    }

    const testGameList = [testGame1, testGame2];

    middleware.findAllGames.mockResolvedValue(testGameList);
    middleware.findGameImagesByGame.mockResolvedValue([{ image : "https://retroresellbucket.s3.us-east-2.amazonaws.com/Mega_Man_Zero_cover%20%281%29.jpg"}])

    render(
        <BrowserRouter>
            <LandingPage />
        </BrowserRouter>
    );

    await waitFor(() => {
        screen.debug();
        expect(screen.getAllByTestId('single-game')).toHaveLength(2);
    });

  });

  test("navigates to game page after clicking", async () => {
    const testGame1 = {
        date: "2024-12-08T11:40:36.009Z",
        description: "The Mega Man Zero series, known as Rockman Zero (ロックマンゼロ Rokkuman Zero) in Japan, is a video game series by Capcom and Inti Creates that debuted in 2002 on the Game Boy Advance. It is the fifth Mega Man game series released by Capcom, and the third series from the original timeline. It stars the titular Zero, who fights against the oppressive rule of the dystopic Neo Arcadia.",
        name : "Megaman Zero",
        price : 20,
        seller : "6736bba037feb3888625bf19",
        __v : 0,
        _id : "675286a8deb51a810e56d6ca"
    }

    const testGameList = [testGame1];

    const navigate = jest.fn()
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);

    middleware.findAllGames.mockResolvedValue(testGameList);
    middleware.findGameImagesByGame.mockResolvedValue([{ image : "https://retroresellbucket.s3.us-east-2.amazonaws.com/Mega_Man_Zero_cover%20%281%29.jpg"}])

    render(
        <BrowserRouter>
            <LandingPage />
        </BrowserRouter>
    );

    await waitFor(() => {
        const singleGame = screen.getByTestId("single-game"); 
        fireEvent.click(singleGame);
        expect(navigate).toHaveBeenCalledWith(`/GameView/${testGame1._id}`);
    });
  });