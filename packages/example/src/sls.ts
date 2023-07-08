import { dev } from "../cli/src/dev";
import testHandler from "./test-lambda";

dev([testHandler]);
