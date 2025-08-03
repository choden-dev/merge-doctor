const prefixKey = (key: string) => `md-ls-${key}` as const;

export const LS_STORED_REMOTE_REPOSITORIES = prefixKey("remote-repos");

export const LS_STORED_TYPECHECK_COMMANDS = prefixKey("type-check-cmds");
export const LS_STORED_FORMATTING_COMMANDS = prefixKey("format-check-cmds");
export const LS_STORED_TEST_COMMANDS = prefixKey("test-check-cmds");
