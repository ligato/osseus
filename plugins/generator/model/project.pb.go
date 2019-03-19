// Code generated by protoc-gen-gogo. DO NOT EDIT.
// source: project.proto

package model

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

// A plugin resource
type Plugin struct {
	Name                 string   `protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`
	Id                   int32    `protobuf:"varint,2,opt,name=id,proto3" json:"id,omitempty"`
	Version              float32  `protobuf:"fixed32,3,opt,name=version,proto3" json:"version,omitempty"`
	Category             string   `protobuf:"bytes,4,opt,name=category,proto3" json:"category,omitempty"`
	Dependencies         []string `protobuf:"bytes,5,rep,name=dependencies,proto3" json:"dependencies,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *Plugin) Reset()         { *m = Plugin{} }
func (m *Plugin) String() string { return proto.CompactTextString(m) }
func (*Plugin) ProtoMessage()    {}
func (*Plugin) Descriptor() ([]byte, []int) {
	return fileDescriptor_8340e6318dfdfac2, []int{0}
}
func (m *Plugin) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Plugin.Unmarshal(m, b)
}
func (m *Plugin) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Plugin.Marshal(b, m, deterministic)
}
func (m *Plugin) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Plugin.Merge(m, src)
}
func (m *Plugin) XXX_Size() int {
	return xxx_messageInfo_Plugin.Size(m)
}
func (m *Plugin) XXX_DiscardUnknown() {
	xxx_messageInfo_Plugin.DiscardUnknown(m)
}

var xxx_messageInfo_Plugin proto.InternalMessageInfo

func (m *Plugin) GetName() string {
	if m != nil {
		return m.Name
	}
	return ""
}

func (m *Plugin) GetId() int32 {
	if m != nil {
		return m.Id
	}
	return 0
}

func (m *Plugin) GetVersion() float32 {
	if m != nil {
		return m.Version
	}
	return 0
}

func (m *Plugin) GetCategory() string {
	if m != nil {
		return m.Category
	}
	return ""
}

func (m *Plugin) GetDependencies() []string {
	if m != nil {
		return m.Dependencies
	}
	return nil
}

func (*Plugin) XXX_MessageName() string {
	return "model.Plugin"
}

// Project holds the data fields stored
type Project struct {
	Name                 string    `protobuf:"bytes,1,opt,name=name,proto3" json:"name,omitempty"`
	PluginName           string    `protobuf:"bytes,2,opt,name=pluginName,proto3" json:"pluginName,omitempty"`
	Id                   int32     `protobuf:"varint,3,opt,name=id,proto3" json:"id,omitempty"`
	Selected             bool      `protobuf:"varint,4,opt,name=selected,proto3" json:"selected,omitempty"`
	Image                string    `protobuf:"bytes,5,opt,name=image,proto3" json:"image,omitempty"`
	Port                 int32     `protobuf:"varint,6,opt,name=port,proto3" json:"port,omitempty"`
	Plugin               []*Plugin `protobuf:"bytes,7,rep,name=plugin,proto3" json:"plugin,omitempty"`
	XXX_NoUnkeyedLiteral struct{}  `json:"-"`
	XXX_unrecognized     []byte    `json:"-"`
	XXX_sizecache        int32     `json:"-"`
}

func (m *Project) Reset()         { *m = Project{} }
func (m *Project) String() string { return proto.CompactTextString(m) }
func (*Project) ProtoMessage()    {}
func (*Project) Descriptor() ([]byte, []int) {
	return fileDescriptor_8340e6318dfdfac2, []int{1}
}
func (m *Project) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_Project.Unmarshal(m, b)
}
func (m *Project) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_Project.Marshal(b, m, deterministic)
}
func (m *Project) XXX_Merge(src proto.Message) {
	xxx_messageInfo_Project.Merge(m, src)
}
func (m *Project) XXX_Size() int {
	return xxx_messageInfo_Project.Size(m)
}
func (m *Project) XXX_DiscardUnknown() {
	xxx_messageInfo_Project.DiscardUnknown(m)
}

var xxx_messageInfo_Project proto.InternalMessageInfo

func (m *Project) GetName() string {
	if m != nil {
		return m.Name
	}
	return ""
}

func (m *Project) GetPluginName() string {
	if m != nil {
		return m.PluginName
	}
	return ""
}

func (m *Project) GetId() int32 {
	if m != nil {
		return m.Id
	}
	return 0
}

func (m *Project) GetSelected() bool {
	if m != nil {
		return m.Selected
	}
	return false
}

func (m *Project) GetImage() string {
	if m != nil {
		return m.Image
	}
	return ""
}

func (m *Project) GetPort() int32 {
	if m != nil {
		return m.Port
	}
	return 0
}

func (m *Project) GetPlugin() []*Plugin {
	if m != nil {
		return m.Plugin
	}
	return nil
}

func (*Project) XXX_MessageName() string {
	return "model.Project"
}
func init() {
	proto.RegisterType((*Plugin)(nil), "model.Plugin")
	proto.RegisterType((*Project)(nil), "model.Project")
}

func init() { proto.RegisterFile("project.proto", fileDescriptor_8340e6318dfdfac2) }

var fileDescriptor_8340e6318dfdfac2 = []byte{
	// 277 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x6c, 0x90, 0x5f, 0x4a, 0xc4, 0x30,
	0x10, 0xc6, 0x49, 0xbb, 0xfd, 0xb3, 0xa3, 0xeb, 0x43, 0xf0, 0x21, 0xf4, 0x61, 0x29, 0x05, 0xa1,
	0x2f, 0x76, 0x41, 0x6f, 0xe0, 0x01, 0x64, 0xc9, 0x0d, 0xda, 0x66, 0x8c, 0x91, 0xb6, 0x29, 0x6d,
	0x2a, 0x78, 0x01, 0x0f, 0xe5, 0x09, 0xbc, 0x87, 0x17, 0x91, 0x9d, 0xac, 0x45, 0xc1, 0xb7, 0xf9,
	0xcd, 0x47, 0xbe, 0xf9, 0xf2, 0xc1, 0x6e, 0x9c, 0xec, 0x0b, 0xb6, 0xae, 0x1a, 0x27, 0xeb, 0x2c,
	0x8f, 0x7a, 0xab, 0xb0, 0xcb, 0x6e, 0xb5, 0x71, 0xcf, 0x4b, 0x53, 0xb5, 0xb6, 0x3f, 0x68, 0xab,
	0xed, 0x81, 0xd4, 0x66, 0x79, 0x22, 0x22, 0xa0, 0xc9, 0xbf, 0x2a, 0xde, 0x19, 0xc4, 0xc7, 0x6e,
	0xd1, 0x66, 0xe0, 0x1c, 0x36, 0x43, 0xdd, 0xa3, 0x60, 0x39, 0x2b, 0xb7, 0x92, 0x66, 0x7e, 0x05,
	0x81, 0x51, 0x22, 0xc8, 0x59, 0x19, 0xc9, 0xc0, 0x28, 0x2e, 0x20, 0x79, 0xc5, 0x69, 0x36, 0x76,
	0x10, 0x61, 0xce, 0xca, 0x40, 0xfe, 0x20, 0xcf, 0x20, 0x6d, 0x6b, 0x87, 0xda, 0x4e, 0x6f, 0x62,
	0x43, 0x0e, 0x2b, 0xf3, 0x02, 0x2e, 0x15, 0x8e, 0x38, 0x28, 0x1c, 0x5a, 0x83, 0xb3, 0x88, 0xf2,
	0xb0, 0xdc, 0xca, 0x3f, 0xbb, 0xe2, 0x83, 0x41, 0x72, 0xf4, 0x1f, 0xfa, 0x37, 0xc9, 0x1e, 0x60,
	0xa4, 0x9c, 0x8f, 0x27, 0x25, 0x20, 0xe5, 0xd7, 0xe6, 0x9c, 0x34, 0x5c, 0x93, 0x66, 0x90, 0xce,
	0xd8, 0x61, 0xeb, 0x50, 0x51, 0x9e, 0x54, 0xae, 0xcc, 0xaf, 0x21, 0x32, 0x7d, 0xad, 0x51, 0x44,
	0x64, 0xe3, 0xe1, 0x74, 0x75, 0xb4, 0x93, 0x13, 0x31, 0x79, 0xd0, 0xcc, 0x6f, 0x20, 0xf6, 0x37,
	0x44, 0x92, 0x87, 0xe5, 0xc5, 0xdd, 0xae, 0xa2, 0x96, 0x2b, 0x5f, 0x99, 0x3c, 0x8b, 0x0f, 0x9b,
	0xcf, 0xaf, 0x3d, 0x6b, 0x62, 0xaa, 0xf4, 0xfe, 0x3b, 0x00, 0x00, 0xff, 0xff, 0x7d, 0x39, 0xe7,
	0x84, 0x99, 0x01, 0x00, 0x00,
}
