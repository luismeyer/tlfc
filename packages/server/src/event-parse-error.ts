import { ZodError, ZodIssue } from "zod";

export class EventParseError extends Error {
  public sdkParseError?: string[];
  public queryParseError?: string[];
  public bodyParseError?: string[];

  private parseError(error: unknown): string[] {
    if (error instanceof ParseError) {
      return error.messages;
    }

    if (error instanceof Error) {
      return [error.message];
    }

    return ["Unknown event parse Error"];
  }

  public setSdkParseError(error: unknown) {
    this.sdkParseError = this.parseError(error);
  }

  public setQueryParseError(error: unknown) {
    this.queryParseError = this.parseError(error);
  }

  public setBodyParseError(error: unknown) {
    this.bodyParseError = this.parseError(error);
  }

  public get response() {
    return {
      bodyParseError: this.bodyParseError,
      queryParseError: this.queryParseError,
      sdkParseError: this.sdkParseError,
    };
  }
}

export class ParseError extends ZodError {
  constructor(issues: ZodIssue[]) {
    super(issues);
  }

  get messages(): string[] {
    return this.issues.map((issue) => {
      if (issue.code === "invalid_type") {
        const path = issue.path.join(".");

        return `'${path}': expected type '${issue.expected}' but received '${issue.received}'`;
      }

      return issue.message;
    });
  }
}
