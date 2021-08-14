// Create a symbolic link from the current working directory to "~/.vscode/extensions/vscode-codex"
package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

func main() {
	// Get the current working directory
	cwd, err := os.Getwd()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	// Get the home directory
	home, err := os.UserHomeDir()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	// Create the path to the vscode extension directory
	extensionDir := filepath.Join(home, ".vscode", "extensions")

	// Create the path to the vscode extension directory
	linkPath := filepath.Join(extensionDir, "vscode-codex")

	// Check if the link already exists
	if _, err := os.Stat(linkPath); err == nil {
		fmt.Println("Link already exists")
		os.Exit(0)
	}

	// Create the link
	if err := os.Symlink(cwd, linkPath); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	// Check if the link was created successfully
	if _, err := os.Stat(linkPath); err != nil {
		fmt.Println("Link was not created")
		os.Exit(1)
	}

	// Check if the extension is already installed
	if _, err := exec.Command("code", "--list-extensions").Output(); err != nil {
		fmt.Println("Extension is not installed")
		os.Exit(1)
	}

	// Install the extension
	if err := exec.Command("code", "--install-extension", "vscode-codex").Run(); err != nil {
		fmt.Println("Extension was not installed")
		os.Exit(1)
	}

	// Check if the extension was installed successfully
	if _, err := exec.Command("code", "--list-extensions").Output(); err != nil {
		fmt.Println("Extension was not installed")
		os.Exit(1)
	}

	fmt.Println("Successfully installed the extension")
}
