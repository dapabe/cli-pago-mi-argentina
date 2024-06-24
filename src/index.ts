#!/usr/bin/env node
import { PromptSequence } from "./PromptSequence.js";

/**
 *  First we check whether or not 'info.txt' exists in the \
 *  same directory. If not creates it and populates it with \
 *  default data.
 */
await PromptSequence.validateBaseFile();
/**
 *  Then show the user:
 *  |-  Current selected enterprises
 *  |   \-  Check which to use in the available selection
 *  |
 *  |-  Enterprises login info
 *  |   \-  Edit username & password
 *  |
 *  |-  Pay methods
 *  |   |-  Add
 *  |   |-  Edit one
 *  |   \-  Delete
 *  |
 *  |-  Next
 *  \-  Exit
 */
await PromptSequence.selectEditAction();
/**
 *  Check if the
 */
await PromptSequence.checkUserPages();
