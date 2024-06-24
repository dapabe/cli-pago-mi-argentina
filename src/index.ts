#!/usr/bin/env node

import { PromptSequence } from "./PromptSequence.js";

await PromptSequence.validateBaseFile();
await PromptSequence.selectEditAction();
await PromptSequence.checkUserPages();
