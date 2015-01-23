require "rails_helper"

describe "Como cadastrista", type: :feature, js: true do
  it "eu posso cadastrar um cliente Pessoa Jurídica" do
    visit root_path

    click_link "Clientes"
    click_link "Criar Cliente"
    click_link "Pessoa Jurídica"

    expect(page).to_not have_css "#pessoa_fisica"
    expect(page).to_not have_css "#cliente_tipo_id option", text: "RESIDENCIAL"

    select "ASSOCIACOES", from: "cliente_tipo_id"
    fill_in "cliente_nome", with: "MARCOS MARCELINO"
    fill_in "cliente_nome_abreviado", with: "M MARCELINO"
    fill_in "cliente_email", with: "orlando_mesquita@mail.com"
    within "#cliente_gera_fatura_antecipada" do
      click_link "Sim"
    end
    within "#cliente_permite_negativacao" do
      click_link "Sim"
    end

    fill_in "cliente_cnpj", with: "28112406000185"
    select_from_autocomplete("acoug", "ACOUGUE", "cliente_ramo_atividade")

    seleciona_responsavel_superior

    click_button "Salvar Cliente"

    expect(page).to have_content "Cliente criado com sucesso"

    validar
  end

  def validar
    fill_in "cliente_nome", with: "marcos"
    fill_in "cliente_cnpj", with: "28112406000185"

    click_button "Pesquisar"

    expect(page).to have_content "MARCOS MARCELINO"
    expect(page).to have_content "28112406000185"
    expect(page).to have_css ".cliente_ativo", text: "Sim"
  end

  def seleciona_responsavel_superior
    click_link "Selecionar cliente responsável superior"
    click_link "Cancelar"
    click_link "Selecionar cliente responsável superior"

    fill_in "cliente_responsavel_superior_cnpj", with: "37217098000143"
    fill_in "cliente_responsavel_superior_nome", with: "LABOR"
    select "MUNICIPAL", from: "cliente_responsavel_superior_esfera_poder_id"
    click_link "Pesquisar responsável superior"
    click_link "Selecionar"
    expect(page).to have_css "span#responsavel_superior_selecionado", text: "LABORATORIO ALFAZEMA"
  end
end