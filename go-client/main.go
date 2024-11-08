package main

import (
	// "github.com/go-vgo/robotgo"
	"fmt"
	"os"
	"path/filepath"

	"github.com/go-vgo/robotgo"
	hook "github.com/robotn/gohook"
	"github.com/vcaesar/imgo"
)

func add() {
	// fmt.Println("--- Press ` (backtick) to take a screenshot ---")

	// Register backtick key for screenshot
	hook.Register(hook.KeyDown, []string{"`"}, func(e hook.Event) {
		// fmt.Println("Backtick pressed - taking screenshot...")
		takeScreenshot()
	})

	s := hook.Start()
	<-hook.Process(s)
}

func takeScreenshot() {

	bitmap := robotgo.CaptureScreen(0)
	defer robotgo.FreeBitmap(bitmap)

	img := robotgo.ToImage(bitmap)
	basePath := "../server/public/"
	filename := getnextFileName(basePath)
	path := filepath.Join(basePath, filename)

	imgo.Save(path, img)

}

func getnextFileName(basePath string) string {
	counter := 1
	baseName := "screenshot"
	ext := ".png"

	for {
		filename := fmt.Sprintf("%s%d%s", baseName, counter, ext)
		fullPath := filepath.Join(basePath, filename)

		if _, err := os.Stat(fullPath); os.IsNotExist(err) {
			// File does not exist, so this filename is available
			return filename
		}
		counter++
	}
}

func main() {
	for {
		add()
	}
}
