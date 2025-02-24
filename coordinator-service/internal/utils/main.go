package utils
import(
	"github.com/mitchellh/mapstructure"
)

func DecodeMapToStruct(data any, result any) error {
	config := &mapstructure.DecoderConfig{
		TagName: "mapstructure",
		Result:  result,
	}

	decoder, err := mapstructure.NewDecoder(config)
	if err != nil {
		return err
	}

	return decoder.Decode(data)
}