package main

import (
	"fmt"
	"strings"
    "os"
	"net"
	"net/http"
    shell "github.com/ipfs/go-ipfs-api"
)

func main() {
	// Where your local node is running on localhost:5001
	sh := shell.NewShell("localhost:5001")
	cid, err := sh.Add(strings.NewReader("Its botch"))
  path := sh.Pin(cid)
	if err != nil {
        fmt.Fprintf(os.Stderr, "error: %s", err)
        os.Exit(1)
	}
  fmt.Printf("added %s", cid)
  fmt.Printf(" added %s", path)
  ip := net.ParseIP(strings.Split(r.Header.Get("X-Forwarded-For"), ",")[0]).String()
  fmt.Printf(" added %s", ip)
}
