# Serena AI Coding Assistant Setup

This project is configured to work with Serena, a powerful AI coding agent toolkit that provides semantic code understanding and editing capabilities.

## What is Serena?

Serena transforms LLMs into agents capable of working directly on codebases through:
- **Symbol-level code discovery** (not grep-based)
- **LSP (Language Server Protocol)** integration for 30+ languages
- **Token-efficient operations** for better context management
- **IDE-like semantic understanding** of code structure

## Prerequisites

1. Install UV (Python package manager):
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

2. Ensure you have Python 3.8+ installed

## Quick Start

### Option 1: Claude Code Integration (Recommended)

If you're using Claude Code, the configuration is already set up in `.claude/serena-config.json`.

1. Claude Code will automatically detect and use Serena for this workspace
2. Serena provides enhanced code understanding for:
   - Finding symbols and references
   - Understanding code relationships
   - Making precise edits at the symbol level

### Option 2: Manual Launch

Launch Serena MCP server manually:

```bash
uvx --from git+https://github.com/oraios/serena serena start-mcp-server --workspace /home/user/Epinera/epin-marketplace
```

### Option 3: Other Clients

Serena works with:
- **Claude Desktop**: Add MCP server configuration
- **VSCode/Cursor**: Use Cline extension with MCP
- **IntelliJ**: MCP plugin support
- **ChatGPT**: Via OpenAPI bridge (mcpo)

## Features Enabled for This Project

✅ TypeScript/JavaScript semantic analysis
✅ Symbol-level code navigation
✅ Intelligent refactoring suggestions
✅ Cross-file relationship understanding
✅ Next.js framework awareness
✅ React component analysis

## Supported Operations

Serena enables advanced operations like:

- `find_symbol`: Locate functions, classes, types by name
- `find_referencing_symbols`: Find all references to a symbol
- `insert_after_symbol`: Add code at specific locations
- `get_symbol_definition`: Retrieve complete symbol definitions
- `list_symbols`: Browse all symbols in a file/directory

## Project-Specific Usage

### Example: Finding Authentication Logic

```typescript
// Serena can find all auth-related symbols across the codebase
find_symbol("createClient") // Finds Supabase client creation
find_referencing_symbols("signInWithOAuth") // Finds all OAuth usage
```

### Example: Refactoring Components

```typescript
// Serena understands component relationships
find_symbol("ProductCard") // Finds the component definition
find_referencing_symbols("ProductCard") // Shows where it's used
```

## Benefits for This Codebase

1. **Faster Navigation**: Jump to definitions across Next.js app router
2. **Better Refactoring**: Understand impact of changes across files
3. **Type Safety**: Leverage TypeScript definitions for accurate edits
4. **Framework Awareness**: Understands Next.js patterns (Server/Client Components)

## Troubleshooting

### Serena not starting?

Check UV installation:
```bash
uv --version
```

### LSP errors?

Ensure TypeScript is installed:
```bash
cd /home/user/Epinera/epin-marketplace
npm install
```

### Performance issues?

Serena may take a moment to index the codebase on first run. Subsequent operations will be faster.

## Resources

- 📚 [Serena Documentation](https://oraios.github.io/serena/)
- 🔧 [GitHub Repository](https://github.com/oraios/serena)
- 💬 [MCP Protocol Spec](https://modelcontextprotocol.io/)

## Integration Status

Current integration level: **Development Tool**

Serena is configured as a development assistant for this codebase. It helps developers (and AI assistants like Claude) understand and modify code more effectively.

---

**Note**: This is a development tool. For user-facing AI features in the marketplace, see the separate AI chatbot implementation docs (coming soon).
