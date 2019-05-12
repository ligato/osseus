package gencalls

func (d *ProjectHandler) FillDocTemplate(packageString string) string {
	// Populate code template with variables
	data := struct {
		PackageName      string
	}{
		PackageName:      packageString,
	}

	return d.fillTemplate("doc.go_template", docTemplate, data)
}
