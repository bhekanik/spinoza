# Project Spinoza

Named after Dutch philosopher Baruch Spinoza, this project is a text to speech application that uses the [Azure Speech API](https://azure.microsoft.com/en-us/services/cognitive-services/speech-api/) to convert text to speech. These speech files are then saved to create your custom podcast.

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Then create a .env file and set the following variables:

```bash
KEY=<your-key>
REGION=<your-region>
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Saved my bacon

- <https://stackoverflow.com/questions/67305210/formdata-with-nextjs-api>
