package gencalls

import (
	"github.com/ligato/osseus/plugins/generator/model"
)

// GenAddProj creates a new generated template under the /template prefix
func (d *ProjectHandler) GenAddProj(key string, val *model.Project) error {
	// Create template
	template := &model.Template{
		Name:     val.GetPluginName(),
		Id:       1,
		Version:  2.4,
		Category: "health",
		Dependencies: []string{
			"grpc",
			"kafka",
			"Logrus",
		},
	}

	// Put new value in etcd
	err := d.broker.Put(val.GetPluginName(), template)
	if err != nil {
		d.log.Errorf("Could not create template")
		return err
	}
	d.log.Infof("Return data, Key: %q Value: %+v", val.GetPluginName(), template)

	return nil
}

// GenDelProj removes a generated project in /template prefix
func (d *ProjectHandler) GenDelProj(val *model.Project) error {
	existed, err := d.broker.Delete(val.GetPluginName())
	if err != nil {
		d.log.Errorf("Could not delete template")
		return err
	}
	d.log.Infof("Delete project successful: ", existed)

	return nil
}
