// Code generated by protoc-gen-gogo. DO NOT EDIT.
// source: rest_template_structure.proto

package restmodel

import (
	fmt "fmt"
	_ "github.com/gogo/protobuf/gogoproto"
	proto "github.com/gogo/protobuf/proto"
	math "math"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.GoGoProtoPackageIsVersion2 // please upgrade the proto package

// FileContent holds the content of the go file
type FileContent struct {
	// Content of the generated code file
	Content              string   `protobuf:"bytes,1,opt,name=content,proto3" json:"content,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *FileContent) Reset()         { *m = FileContent{} }
func (m *FileContent) String() string { return proto.CompactTextString(m) }
func (*FileContent) ProtoMessage()    {}
func (*FileContent) Descriptor() ([]byte, []int) {
	return fileDescriptor_e578eed11d4f8452, []int{0}
}
func (m *FileContent) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_FileContent.Unmarshal(m, b)
}
func (m *FileContent) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_FileContent.Marshal(b, m, deterministic)
}
func (m *FileContent) XXX_Merge(src proto.Message) {
	xxx_messageInfo_FileContent.Merge(m, src)
}
func (m *FileContent) XXX_Size() int {
	return xxx_messageInfo_FileContent.Size(m)
}
func (m *FileContent) XXX_DiscardUnknown() {
	xxx_messageInfo_FileContent.DiscardUnknown(m)
}

var xxx_messageInfo_FileContent proto.InternalMessageInfo

func (m *FileContent) GetContent() string {
	if m != nil {
		return m.Content
	}
	return ""
}

func (*FileContent) XXX_MessageName() string {
	return "restmodel.FileContent"
}

// File holds the folder path, children, type, and etcdkey of the given file
type File struct {
	// Name of generated code file or folder
	Name string `protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`
	// Path of generated code file
	AbsolutePath string `protobuf:"bytes,2,opt,name=absolute_path,json=absolutePath,proto3" json:"absolute_path,omitempty"`
	// "Folder" if a folder in the directory or "File" if code file
	FileType string `protobuf:"bytes,3,opt,name=fileType,proto3" json:"fileType,omitempty"`
	// Key the file is stored under in etcd
	EtcdKey string `protobuf:"bytes,4,opt,name=etcdKey,proto3" json:"etcdKey,omitempty"`
	// Absolute path(s) of direct children folders of the file, empty list if no children
	Children             []string `protobuf:"bytes,5,rep,name=children,proto3" json:"children,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *File) Reset()         { *m = File{} }
func (m *File) String() string { return proto.CompactTextString(m) }
func (*File) ProtoMessage()    {}
func (*File) Descriptor() ([]byte, []int) {
	return fileDescriptor_e578eed11d4f8452, []int{1}
}
func (m *File) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_File.Unmarshal(m, b)
}
func (m *File) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_File.Marshal(b, m, deterministic)
}
func (m *File) XXX_Merge(src proto.Message) {
	xxx_messageInfo_File.Merge(m, src)
}
func (m *File) XXX_Size() int {
	return xxx_messageInfo_File.Size(m)
}
func (m *File) XXX_DiscardUnknown() {
	xxx_messageInfo_File.DiscardUnknown(m)
}

var xxx_messageInfo_File proto.InternalMessageInfo

func (m *File) GetName() string {
	if m != nil {
		return m.Name
	}
	return ""
}

func (m *File) GetAbsolutePath() string {
	if m != nil {
		return m.AbsolutePath
	}
	return ""
}

func (m *File) GetFileType() string {
	if m != nil {
		return m.FileType
	}
	return ""
}

func (m *File) GetEtcdKey() string {
	if m != nil {
		return m.EtcdKey
	}
	return ""
}

func (m *File) GetChildren() []string {
	if m != nil {
		return m.Children
	}
	return nil
}

func (*File) XXX_MessageName() string {
	return "restmodel.File"
}

//TemplateStructure holds the directory and folder structure of the project
type TemplateStructure struct {
	// List of file objects describing directory structure of generated files
	File                 []*File  `protobuf:"bytes,1,rep,name=file,proto3" json:"file,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *TemplateStructure) Reset()         { *m = TemplateStructure{} }
func (m *TemplateStructure) String() string { return proto.CompactTextString(m) }
func (*TemplateStructure) ProtoMessage()    {}
func (*TemplateStructure) Descriptor() ([]byte, []int) {
	return fileDescriptor_e578eed11d4f8452, []int{2}
}
func (m *TemplateStructure) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_TemplateStructure.Unmarshal(m, b)
}
func (m *TemplateStructure) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_TemplateStructure.Marshal(b, m, deterministic)
}
func (m *TemplateStructure) XXX_Merge(src proto.Message) {
	xxx_messageInfo_TemplateStructure.Merge(m, src)
}
func (m *TemplateStructure) XXX_Size() int {
	return xxx_messageInfo_TemplateStructure.Size(m)
}
func (m *TemplateStructure) XXX_DiscardUnknown() {
	xxx_messageInfo_TemplateStructure.DiscardUnknown(m)
}

var xxx_messageInfo_TemplateStructure proto.InternalMessageInfo

func (m *TemplateStructure) GetFile() []*File {
	if m != nil {
		return m.File
	}
	return nil
}

func (*TemplateStructure) XXX_MessageName() string {
	return "restmodel.TemplateStructure"
}
func init() {
	proto.RegisterType((*FileContent)(nil), "restmodel.FileContent")
	proto.RegisterType((*File)(nil), "restmodel.File")
	proto.RegisterType((*TemplateStructure)(nil), "restmodel.TemplateStructure")
}

func init() { proto.RegisterFile("rest_template_structure.proto", fileDescriptor_e578eed11d4f8452) }

var fileDescriptor_e578eed11d4f8452 = []byte{
	// 259 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x3c, 0x90, 0xbf, 0x4e, 0xc3, 0x30,
	0x10, 0xc6, 0x15, 0x62, 0xfe, 0xd4, 0x05, 0x21, 0x3c, 0x59, 0x95, 0x40, 0x51, 0x3a, 0xd0, 0x85,
	0x54, 0x82, 0x85, 0x19, 0x24, 0x16, 0x16, 0x54, 0xba, 0x47, 0x8e, 0x73, 0x4d, 0x22, 0x39, 0x71,
	0xe4, 0x9c, 0x87, 0x3e, 0x06, 0x6f, 0xc5, 0x7b, 0xf0, 0x22, 0xc8, 0x97, 0xa4, 0xdb, 0xf7, 0xf3,
	0x77, 0x9f, 0xef, 0xf4, 0xf1, 0x7b, 0x07, 0x03, 0xe6, 0x08, 0x6d, 0x6f, 0x14, 0x42, 0x3e, 0xa0,
	0xf3, 0x1a, 0xbd, 0x83, 0xac, 0x77, 0x16, 0xad, 0x58, 0x04, 0xbb, 0xb5, 0x25, 0x98, 0xd5, 0x53,
	0xd5, 0x60, 0xed, 0x8b, 0x4c, 0xdb, 0x76, 0x5b, 0xd9, 0xca, 0x6e, 0x69, 0xa2, 0xf0, 0x07, 0x22,
	0x02, 0x52, 0x63, 0x32, 0x7d, 0xe4, 0xcb, 0x8f, 0xc6, 0xc0, 0xbb, 0xed, 0x10, 0x3a, 0x14, 0x92,
	0x5f, 0xea, 0x51, 0xca, 0x28, 0x89, 0x36, 0x8b, 0xdd, 0x8c, 0xe9, 0x4f, 0xc4, 0x59, 0x98, 0x14,
	0x82, 0xb3, 0x4e, 0xb5, 0x30, 0xf9, 0xa4, 0xc5, 0x9a, 0xdf, 0xa8, 0x62, 0xb0, 0xc6, 0x23, 0xe4,
	0xbd, 0xc2, 0x5a, 0x9e, 0x91, 0x79, 0x3d, 0x3f, 0x7e, 0x29, 0xac, 0xc5, 0x8a, 0x5f, 0x1d, 0x1a,
	0x03, 0xfb, 0x63, 0x0f, 0x32, 0x26, 0xff, 0xc4, 0x61, 0x2f, 0xa0, 0x2e, 0x3f, 0xe1, 0x28, 0xd9,
	0xb8, 0x77, 0xc2, 0x90, 0xd2, 0x75, 0x63, 0x4a, 0x07, 0x9d, 0x3c, 0x4f, 0xe2, 0x90, 0x9a, 0x39,
	0x7d, 0xe5, 0x77, 0xfb, 0xa9, 0x92, 0xef, 0xb9, 0x11, 0xb1, 0xe6, 0x2c, 0x7c, 0x2b, 0xa3, 0x24,
	0xde, 0x2c, 0x9f, 0x6f, 0xb3, 0x53, 0x35, 0x59, 0x38, 0x7f, 0x47, 0xe6, 0x1b, 0xfb, 0xfd, 0x7b,
	0x88, 0x8a, 0x0b, 0xea, 0xe0, 0xe5, 0x3f, 0x00, 0x00, 0xff, 0xff, 0x44, 0x76, 0xb4, 0xad, 0x5e,
	0x01, 0x00, 0x00,
}
