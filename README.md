## Code in the Dark - React/Next.js rewrite

This is a rewrite of the Coffescript version, its coded in React/Next.js I have also added a real-time score page and the ability to save the final result. There is also a time laps function where you can see the progress and changes made every 15 second. 

You will need some sort of postgres database for this to work, I used the free hobby version from Heroku.

![image](https://user-images.githubusercontent.com/1506089/160987624-73d4d04c-f2fa-4057-90d1-e7b5746ed77a.png)

## Demo

https://code-in-the-dark.vlx.dk/

### Score page and preview of submission

https://code-in-the-dark.vlx.dk/score


## Getting Started

Create a postgres, a free tier (hobby) at heroku is fine. Add the url to your .env file:
```
DATABASE_URL="postgres://xx:xxxxxxx@xxxxx/xxxxx"
```

To set up your event have a look at the file called  `config/event.tsx` in this file you set up the reference image and the instruction. You can put your images in the public folder.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# to edit or view the database
npx prisma studio
```
### Basic usage

You will be greeted with a form if you access the root of the site. Here the participants can put in there handle and name. They will now be sent to the editor.

The editor will every 15 second send the progress to the backend with the current score.

You can see the current score on this page `/score`, you can also click on each name and see an animation of the progress and the final submission.

### Warning

There has been no consideration about security and a bright person could maybe easily find a way to cheat :)

### TODO (For someone else)

Backend to create new events
Interface to upload assets
Security, maybe github auth or similar
Vote feature

### Credit

https://github.com/codeinthedark/codeinthedark.github.io More about the Code In The Dark concept

https://github.com/MHase/code-in-the-dark-uber-editor/tree/develop/ For some of the CSS and the idea to do a rewrite in React

