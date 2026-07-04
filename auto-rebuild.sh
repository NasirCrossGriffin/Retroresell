#First we must establish the current directory.
original_directory = $(pwd)

cd /portfolio/Retroresell

#Next we delete the old build file.
rm -rf ./backend/build

#Next we rebuild the frontend.
cd gamestore

npm run build

#Next we move the build folder into the backend.
mv build ../backend

#Finally we rebuild the docker container.
cd ../

sudo docker-compose up -d --build

#Finally we go back to the original directory!
cd "original_directory"
