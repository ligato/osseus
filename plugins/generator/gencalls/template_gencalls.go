package gencalls

const goCodeTemplate = `
package main
	
import "fmt"
func main() {
    fmt.Println({{.Title}})
}`

func (d *ProjectHandler) getTemplate() string {
	return goCodeTemplate
}
