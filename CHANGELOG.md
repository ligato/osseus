# Release v1.0.0 (2019-06-10)

## Major Themes

The major themes for Release v1.0.0 are as follows:

* Generate a project directory with:
    * Agent
        - main.go file with code selected from a set of 16 default cn-infra plugins.
        - Agent name (configured from UI).
    * Any number of custom plugins
        - Options.go file
        - Plugin_impl.go file
    * README and doc.go files
* Allow navigation between generated code files to view code from browser.
* Download a tar file containing the directory of folders and generated code files.
* Configure Osseus Projects from UI:
  * Name a project
  * Save a project
  * Delete a project