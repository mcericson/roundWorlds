install node
npm init @vitejs/app (pick vanilla js here)
cd your-project
npm install
npm install three
npm run dev (start editing, every change made to any of the files will be reflected live)

and when you’re done

npm run build (minifies, optimizes, tree shakes, makes sure older browsers can run it, etc)

you can now deploy the contents of /build