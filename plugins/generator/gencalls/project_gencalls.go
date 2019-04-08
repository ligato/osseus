package gencalls

import (
	"archive/tar"
	"bytes"
	"encoding/base64"
	"log"

	"github.com/ligato/osseus/plugins/generator/model"
)

// GenAddProj creates a new generated template under the /template prefix
func (d *ProjectHandler) GenAddProj(key string, val *model.Project) error {
	// Init buf writer
	var buf bytes.Buffer
	tw := tar.NewWriter(&buf)
	// Create tar structure
	var files = []struct {
		Name, Body string
	}{
		{"/cmd/agent/main.go", "Agent file to run plugins"},
		{"/plugins/plugin_impl_test.go", "Plugin file that holds main functions"},
		{"/plugins/doc.go", "Doc file for package description"},
		{"/plugins/options.go", "Config file for plugin"},
	}
	// Loop through files & write to tar
	for _, file := range files {
		hdr := &tar.Header{
			Name: file.Name,
			Mode: 0600,
			Size: int64(len(file.Body)),
		}
		if err := tw.WriteHeader(hdr); err != nil {
			log.Fatal(err)
		}
		if _, err := tw.Write([]byte(file.Body)); err != nil {
			log.Fatal(err)
		}
	}
	// Close once done & turn into []byte
	if err := tw.Close(); err != nil {
		log.Fatal(err)
	}

	arr := buf.Bytes()
	encodedTar := base64.StdEncoding.EncodeToString(arr)

	// Create template
	template := &model.Template{
		Name:     val.GetProjectName(),
		Id:       1,
		Version:  2.4,
		Category: "health",
		Dependencies: []string{
			"grpc",
			"kafka",
			"Logrus",
		},
		TarFile: encodedTar,
	}

	// Put new value in etcd
	err := d.broker.Put(val.GetProjectName(), template)
	if err != nil {
		d.log.Errorf("Could not create template")
		return err
	}
	d.log.Infof("Return data, Key: %q Value: %+v", val.GetProjectName(), template)

	return nil
}

// GenDelProj removes a generated project in /template prefix
func (d *ProjectHandler) GenDelProj(val *model.Project) error {
	existed, err := d.broker.Delete(val.GetProjectName())
	if err != nil {
		d.log.Errorf("Could not delete template")
		return err
	}
	d.log.Infof("Delete project successful: ", existed)

	return nil
}
