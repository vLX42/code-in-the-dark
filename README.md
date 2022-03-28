## Code in the Dark - React/Next.js rewrite

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
```
### Basic usage

You will be greated with a form if you access the root of the site. Here the participants can put in there handle and name. They will now be send to the editor.

The editor will every 15 second send the progress to the backend with the current score.

You can see the current score on this page `/score`, you can also click on each name and see an animation of the progress and the final submission.

### Warning

There has been no consideration about security and a bright person could maybe easy find a way to cheat :)

### TODO (For someone else)

Backend to create new events
Interface to upload assets
Security, maybe github auth or simular
Vote feature

#### Credit

https://github.com/MHase/code-in-the-dark-uber-editor/tree/develop/ For some of the css and the idea to do a rewrite in React